from datetime import timedelta
import io
import os
import time
import requests as request
import pandas as pd
from prefect import flow, task, get_run_logger
from minio import Minio
from pymongo import MongoClient

YEAR = 2022
FILE_PATH = f"ERP/7eData/{YEAR}"
FILE_NAME = "recintos_almendros_parcelas.xlsx"


@task(retries=3, retry_delay_seconds=20)
def extract():
    logger = get_run_logger()
    # Connect to MinIO
    ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT")
    SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT")
    MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST")
    minio_client = Minio(MINIO_HOST, access_key=ACCESS_ROOT,
                         secret_key=SECRET_ROOT, secure=False)

    print("extracting data")
    logger.info("extracting data")
    data = minio_client.get_object(
        "trusted-zone", f"{FILE_PATH}/{FILE_NAME}").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1", na_values=[""])
    return df


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
def extract_geographic_info(enclosureIds: list):
    logger = get_run_logger()
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")
    logger.info(f"enclosureIds: {enclosureIds}")
    body = {
        "operation": "recintos",
        "year": YEAR,
        "epsgCode": "4258",
        "ids": enclosureIds
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    # Do it in batches of 10
    response = request.post(
    AGROSLAB_API_URL, headers=headers, json=body)
    if response.status_code != 200:
        raise Exception("Error getting enclosure geographic info")
    return response.json()

@task(retries=3, retry_delay_seconds=10,timeout_seconds=15)
def extract_meteorological_station(enclosureId: str):
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")
    body = {
        "operation" : "aemetestacionesdwithin",
        "id": enclosureId,
        "distanceinkilometers": 50,
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = request.post(
        AGROSLAB_API_URL, headers=headers, json=body)
    if response.status_code != 200:
        raise Exception("Error getting meteorological station")
    nearest_meteo_stations = response.json()
    # Get the nearest meteorological station
    # Calculate the min distance in an object array
    min_distance = min(nearest_meteo_stations["aemet_estaciones"], key=lambda x: x["distancia (km)"])
    return min_distance


@task
def transform_parcelas(df: pd.DataFrame):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    # Convert to Digital Twin domain
    # Loop through the rows using intertuples()
    enclosuresProperties = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"
        # Get enclosures
        enclosureProperties = {
            "id": enclosureId,
            "geographicSpot": row.parcelGeographicSpot,
            "cropId": row.cropId,
            "areaSIGPAC": row.areaSIGPAC,
            "area": row.area,
            "varietyId": row.parcelVarietyId,
            "irrigationKind": row.irrigationKind,
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

    # Remove duplicates by enclosureId
    enclosuresProperties = list({v['id']: v for v in enclosuresProperties}.values())
    return enclosuresProperties


@task
def join_information(enclosureProperties, enclosure_geographic_info, enclosure_meteorological_stations):
    logger = get_run_logger()
    print("joining data")
    logger.info("joining data")
    # Join enclosures with geographic info
    joined_enclosure = {
            "year": YEAR,
            "id": enclosureProperties["id"],
            "type": "enclosure",
            "geometry": enclosure_geographic_info["geometry"],
            "meteoStation": {
                "idema": enclosure_meteorological_stations["id"],
                "name": enclosure_meteorological_stations["nombre"],
                "distance(km)": enclosure_meteorological_stations["distancia (km)"],
            },
            "properties": {
                **enclosureProperties,
                "irrigationCoef": enclosure_geographic_info["properties"]["coef_regadio"],
                "admisibility": enclosure_geographic_info["properties"]["admisibilidad"],
            },
        }
    return joined_enclosure


@task
def load(enclosures):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")

    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]
    # Insert enclosures filtered by id and year
    # db.Enclosures.create_index("id", unique=True)
    for enclosure in enclosures:
        db.Enclosures.update_one(
            {"id": enclosure["id"], "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


@flow(name="recintos_almendros_parcelas_dt_etl")
def recintos_almendros_parcelas_dt_etl():
    df = extract()
    enclosuresProperties = transform_parcelas(df)
    # Process enclosures in batches of 1 because we depend on an external API
    for enclosureProperties in enclosuresProperties:
        enclosure_geographic_info = extract_geographic_info(
            [enclosureProperties["id"]])
        enclosure_meteorological_stations = extract_meteorological_station(
            enclosureProperties["id"])
        joined_enclosure = join_information(
            enclosureProperties, enclosure_geographic_info["features"][0], enclosure_meteorological_stations)
        load([joined_enclosure])
        time.sleep(2)

if __name__ == "__main__":
    recintos_almendros_parcelas_dt_etl()
