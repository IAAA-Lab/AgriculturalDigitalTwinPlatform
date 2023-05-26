import asyncio
from datetime import timedelta
import datetime
import io
import os

from etl.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
import requests as request
import pandas as pd
from prefect import flow, task, get_run_logger
from prefect.tasks import task_input_hash
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
from prefect.deployments import run_deployment


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value
NDVI_EXTRACT_FIRST_DATE = "01-01-2020"
HISTORIC_WEATHER_EXTRACT_FIRST_DATE = "01-01-2018"
CURRENT_DATE_FORMATTED = datetime.datetime.now().strftime("%d-%m-%Y")


@task(retries=3, retry_delay_seconds=20)
async def extract_enclosures_properties(file_name: str):
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


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_geographic_info(enclosureIds: list[str], year: int):
    await asyncio.sleep(1)

    logger = get_run_logger()
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

    try:
        response = request.post(
            AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
        if response.status_code != 200:
            logger.error(
                f"Error getting enclosure geographic info for enclosureIds: {enclosureIds}")
            return None
        return response.json()
    except Exception as e:
        logger.error(
            f"Error getting enclosure geographic info for enclosureIds: {enclosureIds}" - {e})
    return None


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_meteorological_station(enclosureId: str):
    await asyncio.sleep(1)

    logger = get_run_logger()
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetestacionesdwithin",
        "id": enclosureId,
        "distanceinkilometers": 50,
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    try:
        response = request.post(
            AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
        if response.status_code != 200:
            logger.error(
                f"Error getting meteorological station for enclosureId: {enclosureId}")
            return None
        nearest_meteo_stations = response.json()
        # Get the nearest meteorological station
        # Calculate the min distance in an object array

        min_distance = min(
            nearest_meteo_stations["aemet_estaciones"], key=lambda x: x["distancia (km)"])
        return min_distance
    except Exception as e:
        logger.error(
            f"Error getting meteorological station for enclosureId: {enclosureId} - {e}")
    return None


@task
async def transform_parcelas(df: pd.DataFrame):
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
async def join_information(enclosureProperties, enclosure_geographic_info, enclosure_meteorological_stations, year: int):
    # Join enclosures with geographic info
    try:
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
    except Exception as e:
        logger = get_run_logger()
        logger.error(
            f"Error joining information for enclosureId: {enclosureProperties['id']} - {e}")
        return None


@task
async def load_enclosures(enclosure: dict):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert enclosures filtered by id and year
    # db.Enclosures.create_index("id", unique=True)
    db.Enclosures.update_one(
        {"id": enclosure["id"], "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


# ----------------- Flows -----------------

@flow(name="geographic_data_recintos")
async def geographic_data_recintos(enclosureIds: list[str], year: int):
    return await extract_geographic_info(enclosureIds, year)


@flow(name="meteorological_station_recintos")
async def meteorological_station_recintos(enclosureId: str):
    return await extract_meteorological_station(enclosureId)


@flow(name="recintos_almendros_parcels_dt_etl")
async def recintos_almendros_parcels_dt_etl(file_name: str):
    # Extract
    object = await extract_enclosures_properties(file_name)
    dfParcels = object["parcels"]
    year = object["year"]
    enclosuresProperties = await transform_parcelas(dfParcels)
    # Asynchronously extract the rest of the information
    # Run the flows asynchronously
    ndvi_flow_tasks = []
    for enclosureProperties in enclosuresProperties:
        enclosureId = enclosureProperties["id"]
        ndvi_flow_tasks.append(run_deployment("ndvi_etl/event-driven", parameters={
            "enclosure_id": enclosureId, "date_init": NDVI_EXTRACT_FIRST_DATE, "date_end": CURRENT_DATE_FORMATTED}))
    future_ndvi_tasks = asyncio.gather(*ndvi_flow_tasks)

    unique_meteoStationIds = []
    for enclosureProperties in enclosuresProperties:
        enclosureId = enclosureProperties["id"]
        # Run the flows asynchronously
        data = await asyncio.gather(
            geographic_data_recintos([enclosureId], year),
            meteorological_station_recintos(enclosureId),
        )
        geographic_data_raw = data[0]
        meteo_data_raw = data[1]
        # Join
        joined_enclosure = await join_information(
            enclosureProperties, geographic_data_raw, meteo_data_raw, year)
        if joined_enclosure is None:
            continue
        # Load
        await load_enclosures(joined_enclosure)
        # Get the unique meteoStationIds
        if meteo_data_raw is not None:
            unique_meteoStationIds.append(meteo_data_raw["id"])
    # Get the unique meteoStationIds
    unique_meteoStationIds = list(set(unique_meteoStationIds))
    # Asynchronously extract the rest of the information
    await run_deployment(name="cultivos_identificadores_dt_etl/event-driven")
    for meteoStationId in unique_meteoStationIds:
        await run_deployment(name="historical_weather_dt_etl/event-driven", parameters={
            "meteo_station_id": meteoStationId, "date_init": HISTORIC_WEATHER_EXTRACT_FIRST_DATE, "date_end": CURRENT_DATE_FORMATTED})
    # Wait for the flows to finish
    await future_ndvi_tasks

if __name__ == "__main__":
    asyncio.run(recintos_almendros_parcels_dt_etl())
    # Add crops to enclosures
    cultivos_identificadores_dt_etl()
