import asyncio
from datetime import timedelta
import time
import io
import os
from etl.event_driven.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
import requests as request
import pandas as pd
from prefect import flow, task, get_run_logger
from prefect.tasks import task_input_hash
from pymongo import MongoClient
from etl.utils.functions import DB_MinioClient, DB_MongoClient
from etl.utils.constants import Constants

BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


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
    await asyncio.sleep(2)

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
    await asyncio.sleep(2)

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


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_historial_weather_data(meteoStationId: str, enclosureId: str, year: int):
    await asyncio.sleep(2)

    logger = get_run_logger()
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetclimatologiadiaria",
        "initdate": f"01-01-{year}",
        "enddate": f"31-12-{year}",
        "idema": meteoStationId
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    try:
        response = request.post(
            AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
        if response.status_code != 200:
            logger.error(
                f"Error getting historic weather data for enclosureId: {enclosureId} and meteoStationId: {meteoStationId}")
            return None
        return response.json()
    except Exception as e:
        logger.error(
            f"Error getting historic weather data for enclosureId: {enclosureId} and meteoStationId: {meteoStationId} - {e}")
    return None


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
async def extract_ndvi(enclosureId: str, year: int) -> dict:
    await asyncio.sleep(2)
    logger = get_run_logger()

    AGROSLAB_TELEDETECTION_URL = os.environ.get("AGROSLAB_TELEDETECTION_URL")
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")

    body = {
        "operation": "getndviindexmeanvaluezone",
        "initdate": f"01-01-{year}",
        "enddate": f"31-12-{year}",
        "id": enclosureId
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    try:
        # TODO: verify=True when we have a valid certificate
        response = request.post(
            AGROSLAB_TELEDETECTION_URL, headers=headers, json=body, verify=False, timeout=10)
        if response.status_code != 200:
            logger.error(
                f"Error getting ndvi for enclosureId: {enclosureId}" - {response.text})
            return None
        # Get the latest ndvi value
        ndvi = response.json()
        return ndvi

    except Exception as e:
        logger.error(
            f"Error getting ndvi for enclosureId: {enclosureId} - {e}")
    return None


@task
async def transform_historic_weather_data(weather_data: dict, enclosureId: str):
    if weather_data is None:
        return None
    logger = get_run_logger()

    weather_data_list = []
    for weather_data_item in weather_data:
        try:
            weather_data_list.append(
                {
                    "date": pd.to_datetime(weather_data_item["fecha"]),
                    "idema": weather_data_item["indicativo"],
                    "height": float(weather_data_item["altitud"].replace(",", ".")),
                    "tmed": float(weather_data_item["tmed"].replace(",", ".")),
                    # If prec is not a number, set it to 0
                    "prec": float(weather_data_item["prec"].replace(",", ".")) if weather_data_item["prec"].replace(",", ".").isnumeric() else 0,
                    "tmin": float(weather_data_item["tmin"].replace(",", ".")),
                    "horaTmin": weather_data_item["horatmin"],
                    "tmax": float(weather_data_item["tmax"].replace(",", ".")),
                    "horaTmax": weather_data_item["horatmax"],
                    "dir": float(weather_data_item["dir"].replace(",", ".")),
                    "velmedia": float(weather_data_item["velmedia"].replace(",", ".")),
                    "racha": float(weather_data_item["racha"].replace(",", ".")),
                    "horaracha": weather_data_item["horaracha"],
                }
            )
        except Exception as e:
            logger.error(
                f"Error transforming historic weather data for enclosureId: {enclosureId} - {e}")
    return weather_data_list


@task
async def transform_ndvi(ndvi_list, enclosureId: str):
    ndvi = ndvi_list["respuesta"]
    ndvi_list = []
    for ndvi_item in ndvi:
        for key, value in ndvi_item.items():
            datetime = pd.to_datetime(key)
            ndvi_list.append(
                {"date": datetime, "value": value, "enclosureId": enclosureId})
    return ndvi_list


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
                "id": row.cropId,
            },
            "areaSIGPAC": row.areaSIGPAC,
            "area": row.area,
            "varietyId": row.parcelVarietyId,
            "rainfedOrIrrigated": row.irrigationKind,
            "tenureRegimeId": row.tenureRegimeId,
            "plantationYear": row.plantationYear,
            "numberOfTrees": row.numberOfTrees,
            "plantationDensity": row.plantationDensity,
            "ATRIA_ADV_ASV": row.ATRIA_ADV_ASV,
            "vulnerableArea": row.parcelVulnerableArea,
            "specificZones": row.specificZones,
            "parcelUse": row.parcelUse,
            "slope": row.slope,
            "UHC": row.UHC,
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


@task
async def load_weather_data(weather_data_list: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Because update_one is really slow, we use insert_many
    for weather_data in weather_data_list:
        db.WeatherData.update_one({"idema": weather_data["idema"], "date": weather_data["date"]}, {
                                  "$set": weather_data}, upsert=True)


@task
async def load_ndvi(ndvi_list: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    for ndvi in ndvi_list:
        db.NDVI.update_one(
            {"enclosureId": ndvi["enclosureId"], "date": ndvi["date"]}, {"$set": ndvi}, upsert=True)

# ----------------- Flows -----------------


@flow(name="ndvi_recintos")
async def ndvi_recintos(enclosureId: str, year: int):
    ndvi_raw = await extract_ndvi(enclosureId, year)
    if ndvi_raw is None:
        return None
    ndvi_processed = await transform_ndvi(ndvi_raw, enclosureId)
    await load_ndvi(ndvi_processed)


@flow(name="geographic_data_recintos")
async def geographic_data_recintos(enclosureIds: list[str], year: int):
    return await extract_geographic_info(enclosureIds, year)


@flow(name="meteorological_station_recintos")
async def meteorological_station_recintos(enclosureId: str):
    return await extract_meteorological_station(enclosureId)


@flow(name="historic_weather_data_recintos")
async def historic_weather_data_recintos(meteoStationId: str, enclosureId: str, year: int):
    weather_data_raw = await extract_historial_weather_data(meteoStationId, enclosureId, year)
    if weather_data_raw is None:
        return None
    weather_data_processed = await transform_historic_weather_data(weather_data_raw, enclosureId)
    await load_weather_data(weather_data_processed)


@flow(name="recintos_almendros_parcelas_dt_etl")
async def recintos_almendros_parcelas_dt_etl(file_name: str):
    # Extract
    object = await extract_enclosures_properties(file_name)
    dfParcels = object["parcels"]
    year = object["year"]
    enclosuresProperties = await transform_parcelas(dfParcels)
    # Asynchronously extract the rest of the information
    unique_meteoStationIds = []
    for enclosureProperties in enclosuresProperties:
        enclosureId = enclosureProperties["id"]
        # Run the flows asynchronously
        data = await asyncio.gather(
            geographic_data_recintos([enclosureId], year),
            meteorological_station_recintos(enclosureId),
            ndvi_recintos(enclosureId, year),
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
    for meteoStationId in unique_meteoStationIds:
        await historic_weather_data_recintos(meteoStationId, enclosureId, year)


if __name__ == "__main__":
    asyncio.run(recintos_almendros_parcelas_dt_etl())
    # Add crops to enclosures
    cultivos_identificadores_dt_etl()
