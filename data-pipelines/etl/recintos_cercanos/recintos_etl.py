import io
from utils.constants import Constants
from utils.functions import DB_MinioClient
import os
from datetime import timedelta
import pandas as pd
from utils.functions import DB_MongoClient
import requests
import asyncio
# Get rid of insecure warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value


def extract_geographic_info(enclosureIds: list[str], year: int):

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

    response = requests.post(
        AGROSLAB_API_URL, headers=headers, json=body, timeout=28)
    if response.status_code != 200:
        raise Exception(
            f"Error getting enclosure geographic info for enclosureIds: {enclosureIds} - request: {response.text}")
    return response.json()


def extract_meteorological_station(enclosureId: str):

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
        response = requests.post(
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


def extract_ccaa_and_province(enclosure_id: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, "provinces.xlsx").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1", na_values=[''])
    # Get the province and ccaa
    province_id = enclosure_id.split("-")[0]
    province = df.loc[df['Código Provincia'] == int(province_id)]
    province_name = province["Nombre Provincia"].values[0]
    ccaa = province["Nombre CCAA"].values[0]
    return ccaa, province_name


def join_information(enclosure_geographic_info, crs, enclosure_meteorological_stations, year: int, enclosure_id: str, ccaa: str, province: str):
    joined_enclosure = {
        "id": enclosure_id,
        "year": int(year),
        "type": "Feature",
        "geometry": enclosure_geographic_info["geometry"],
        "meteoStation": {
            "idema": enclosure_meteorological_stations["id"],
            "name": enclosure_meteorological_stations["nombre"],
            "distance(km)": enclosure_meteorological_stations["distancia (km)"],
        },
        "location": {
            "ccaa": ccaa,
            "province": province,
        },
        "properties": {
            # m2 to ha
            "area": enclosure_geographic_info["properties"]["superficie"] / 10000,
            "slope": enclosure_geographic_info["properties"]["pendiente_media"],
            "parcelUse": enclosure_geographic_info["properties"]["uso_sigpac"],
            "region": enclosure_geographic_info["properties"]["region"],
            "irrigationCoef": enclosure_geographic_info["properties"]["coef_regadio"],
            "admisibility": enclosure_geographic_info["properties"]["admisibilidad"],
        },
        "crs": crs
    }
    return joined_enclosure


def load_enclosures(enclosures):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Insert enclosures filtered by id and year
    for enclosure in enclosures:
        db.Enclosures.update_one(
            {"id": enclosure["id"], "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)
    # Create a 2dsphere index for the geometry field
    db.Enclosures.create_index([("geometry", "2dsphere")])


def recintos_etl(year: int, enclosure_ids: list[str]):
    enclosures_geographic_info = extract_geographic_info(enclosure_ids, year)
    joined_enclosures = []
    for enclosure_geographic_info in enclosures_geographic_info["features"]:
        try:
            properties = enclosure_geographic_info["properties"]
            enclosure_id = f"{properties['provincia']}-{properties['municipio']}-{properties['agregado']}-{properties['zona']}-{properties['poligono']}-{properties['parcela']}-{properties['recinto']}"
            meteorological_info = extract_meteorological_station(enclosure_id)
            ccaa, province = extract_ccaa_and_province(enclosure_id)
            joined_enclosure = join_information(
                enclosure_geographic_info, enclosures_geographic_info["crs"], meteorological_info, year, enclosure_id, ccaa, province)
            joined_enclosures.append(joined_enclosure)
        except Exception as e:
            print(e)
    load_enclosures(joined_enclosures)


if __name__ == "__main__":
    enclosureIds = ["45-137-0-0-9-23-1", "45-137-0-0-9-23-2"]
    year = 2022
    asyncio.run(recintos_etl(year, enclosureIds))
