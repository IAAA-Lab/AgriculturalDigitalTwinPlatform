import asyncio
from datetime import timedelta
import io
import os
import requests as request
import pandas as pd
from prefect import flow, task, get_run_logger
from prefect.tasks import task_input_hash
from pymongo import MongoClient
from etl.dtStorage.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl


from etl.utils.functions import DB_MinioClient

YEAR = 2022
FILE_PATH = f"ERP/7eData/{YEAR}"
METADATA_VAL = "excel_almendros_cercanos_parcelas"
FILE_NAME = "Recintos_Almendros_Cercanos_y_Otros_Cultivos_PARCELAS_2022.xlsx"


@task(retries=3, retry_delay_seconds=20)
async def extract_enclosures_properties():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        "trusted-zone", f"{FILE_PATH}/{FILE_NAME}").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1", na_values=[""])
    return df

@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10))
async def extract_geographic_info(enclosureIds: list[str]):
    logger = get_run_logger()
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "recintos",
        "year": YEAR,
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

@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10))
async def extract_meteorological_station(enclosureId: str):
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

@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10))
async def extract_historial_weather_data(meteoStationId: str, enclosureId: str):
    logger = get_run_logger()
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetclimatologiadiaria",
        "initdate": f"01-01-{YEAR}",
        "enddate": f"31-12-{YEAR}",
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

@task(retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10))
async def extract_ndvi(enclosureId: str) -> dict:
    logger = get_run_logger()

    AGROSLAB_TELEDETECTION_URL = os.environ.get("AGROSLAB_TELEDETECTION_URL")
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")

    body = {
        "operation": "getndviindexmeanvaluezone",
        "initdate": f"01-01-{YEAR}",
        "enddate": f"31-12-{YEAR}",
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
async def transform_historic_weather_data(weather_data: dict):
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
async def transform_parcelas(df: pd.DataFrame, enclosureIds: list):
    # Convert to Digital Twin domain
    if enclosureIds is not None:
        enclosure_id_splitted = [enclosureId.split(
            "-") for enclosureId in enclosureIds]
        # Filter the dataframe by enclosureIds
        df = df[df.apply(lambda x: [x.parcelProvinceId, x.parcelMunicipalityId, x.parcelAggregatedId,
                         x.parcelZoneId, x.parcelPolygonId, x.parcelId, x.parcelEnclosureId] in enclosure_id_splitted, axis=1)]
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
async def join_information(enclosureProperties, enclosure_geographic_info, enclosure_meteorological_stations):
    # Join enclosures with geographic info
    joined_enclosure = {
        "year": YEAR,
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
async def load_enclosures(enclosure: dict):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]
    # Insert enclosures filtered by id and year
    # db.Enclosures.create_index("id", unique=True)
    db.Enclosures.update_one(
            {"id": enclosure["id"], "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


@task
async def load_weather_data(weather_data_list: list):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]

    # Because update_one is really slow, we use insert_many
    for weather_data in weather_data_list:
        db.WeatherData.update_one({"idema": weather_data["idema"], "date": weather_data["date"]}, {
                                  "$set": weather_data}, upsert=True)


@task
async def load_ndvi(ndvi_list: list):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]

    for ndvi in ndvi_list:
        db.NDVI.update_one(
            {"date": ndvi["date"], "enclosureId": ndvi["enclosureId"]}, {"$set": ndvi}, upsert=True)

@flow(name="recintos_almendros_parcelas_dt_etl")
async def recintos_almendros_parcelas_dt_etl(enclosureIds: list[str] = None):
    # Extract
    df = await extract_enclosures_properties()
    enclosuresProperties = await transform_parcelas(df, enclosureIds)
    # Asynchronously extract the rest of the information
    unique_meteoStationIds = []
    for enclosureProperties in enclosuresProperties:
        enclosureId = enclosureProperties["id"]
        asyncio.sleep(2)
        # Extract concurrently
        tasks = [extract_ndvi(enclosureId), extract_geographic_info([enclosureId]), extract_meteorological_station(enclosureId)]
        ndvi_data_raw, geographic_data_raw, meteo_stations_raw = await asyncio.gather(*tasks)
        if meteo_stations_raw is not None and meteo_stations_raw["id"] is not None and meteo_stations_raw["id"] not in unique_meteoStationIds:
            unique_meteoStationIds.append(meteo_stations_raw["id"])
            weather_data_raw = await extract_historial_weather_data(meteo_stations_raw["id"], enclosureId)
        # Transform and load
        if ndvi_data_raw is not None:
            ndvi_data_processed = await transform_ndvi(ndvi_data_raw, enclosureId)
            await load_ndvi(ndvi_data_processed)
        if geographic_data_raw is not None and meteo_stations_raw is not None:
            joined_enclosure = await join_information(enclosureProperties, geographic_data_raw, meteo_stations_raw)
            await load_enclosures(joined_enclosure)
        if weather_data_raw is not None:
            weather_data_processed = await transform_historic_weather_data(weather_data_raw)
            weather_data_raw = None
            await load_weather_data(weather_data_processed)

if __name__ == "__main__":
    asyncio.run(recintos_almendros_parcelas_dt_etl())
    # Add crops to enclosures
    cultivos_identificadores_dt_etl()
