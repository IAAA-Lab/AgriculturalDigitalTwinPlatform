import asyncio
from datetime import timedelta
import datetime
import io
import os

from etl.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
import requests as request
import pandas as pd
from prefect import flow, task
from prefect.tasks import task_input_hash
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
from prefect.deployments import run_deployment

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value
CURRENT_DATE_FORMATTED = datetime.datetime.now().strftime("%d-%m-%Y")


@task(retries=3, retry_delay_seconds=20)
def extract_enclosures_properties(file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, file_name).read()
    stats = minio_client.stat_object(BUCKET_FROM_NAME, file_name)
    df = pd.read_parquet(io.BytesIO(data))
    return {
        "parcels": df,
        "year": stats.metadata["x-amz-meta-year"],
    }


@task(retries=2, retry_delay_seconds=3, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_geographic_info(enclosureIds: list[str], year: int):

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "recintos",
        "year": year,
        "epsgCode": "4258",
        "ids": enclosureIds
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = request.post(
        AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
    if response.status_code != 200:
        raise Exception(
            f"Error getting enclosure geographic info for enclosureIds: {enclosureIds} - request: {response.text}")
    return response.json()


@task(retries=2, retry_delay_seconds=3, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_meteorological_station(enclosureId: str):

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetestacionesdwithin",
        "id": enclosureId,
        "distanceinkilometers": 100,
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }
    try:
        response = request.post(
            AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
        if response.status_code != 200:
            raise Exception(
                f"Error getting meteorological station for enclosureId: {enclosureId} - request: {response.text}")
        nearest_meteo_stations = response.json()
        # Get the nearest meteorological station by calculating the min distance in an object array
        return min(nearest_meteo_stations["aemet_estaciones"], key=lambda x: x["distancia (km)"])
    except Exception as e:
        # Add enclosureId to the exception
        raise Exception(
            f"Error getting meteorological station for enclosureId: {enclosureId}") from e


@task
def transform_parcelas(df: pd.DataFrame):
    # Loop through the rows using intertuples()
    enclosuresProperties = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"
        # Get enclosures
        enclosureProperties = {
            "id": enclosureId,
            "geographicSpot": row.parcelGeographicSpot,
            "crop": {
                "id": str(row.cropId),
            },
            "areaSIGPAC": row.areaSIGPAC,
            "area": row.area,
            "varietyId": str(row.parcelVarietyId),
            "rainfedOrIrrigated": row.irrigationKind,
            "tenureRegimeId": str(row.tenureRegimeId),
            "plantationYear": row.plantationYear,
            "numberOfTrees": row.numberOfTrees,
            "plantationDensity": row.plantationDensity,
            "ATRIA_ADV_ASV": row.ATRIA_ADV_ASV,
            "vulnerableArea": row.parcelVulnerableArea,
            "specificZones": row.specificZones,
            "parcelUse": row.parcelUse,
            "slope": row.slope,
            "UHC": str(row.UHC),
            "UHCDescription": row.UHCDescription,
            "ZEPAZone": row.ZepaZone,
            "SIEZone": row.SIEZone,
        }

        enclosuresProperties.append(enclosureProperties)

    return enclosuresProperties


@task
def join_information(enclosureProperties, enclosure_geographic_info, enclosure_meteorological_stations, year: int):
    joined_enclosure = {
        "year": int(year),
        "id": enclosureProperties["id"],
        "type": "Feature",
        "geometry": enclosure_geographic_info["features"][0]["geometry"],
        "meteoStation": {
            "idema": enclosure_meteorological_stations["id"],
            "name": enclosure_meteorological_stations["nombre"],
            "distance(km)": enclosure_meteorological_stations["distancia (km)"],
        },
        "properties": {
            **enclosureProperties,
            "irrigationCoef": enclosure_geographic_info["features"][0]["properties"]["coef_regadio"],
            "admisibility": enclosure_geographic_info["features"][0]["properties"]["admisibilidad"],
        },
        "crs": enclosure_geographic_info["crs"],
    }
    return joined_enclosure


@task
def load_enclosures(enclosure: dict):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert enclosures filtered by id and year
    db.Enclosures.update_one(
        {"id": enclosure["id"], "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


# ----------------- Flows -----------------

@flow(name="recintos_almendros_parcels_dt_etl")
async def recintos_almendros_parcels_dt_etl(file_name: str):
    # Extract
    object = extract_enclosures_properties(file_name)
    dfParcels = object["parcels"]
    year = object["year"]
    enclosuresProperties = transform_parcelas(dfParcels)
    # Run the enclosures etl flow for each enclosure asynchronously
    for enclosureProperties in enclosuresProperties:
        enclosureId = enclosureProperties["id"]
        # Extract
        results = await asyncio.gather(*[extract_geographic_info([enclosureId], year), extract_meteorological_station(enclosureId)], return_exceptions=True)
        geographic_data_raw = results[0]
        if isinstance(geographic_data_raw, Exception):
            continue
        meteo_data_raw = results[1]
        if isinstance(meteo_data_raw, Exception):
            continue
        # Transform
        joined_enclosure = join_information.submit(
            enclosureProperties, geographic_data_raw, meteo_data_raw, year).result(raise_on_failure=False)
        if isinstance(joined_enclosure, Exception):
            continue
        # Load
        load_enclosures.submit(joined_enclosure).result(raise_on_failure=False)

    # Asynchronously extract the rest of the information
    await run_deployment(
        name="cultivos_identificadores_dt_etl/event-driven")
    await run_deployment(
        name="historical_weather_scheduled_etl/scheduled")
    await run_deployment(
        name="ndvi_scheduled_etl/scheduled")


if __name__ == "__main__":
    asyncio.run(recintos_almendros_parcels_dt_etl(
        file_name="recintos_almendros_parcels_dt_etl.csv"))
