from prefect import task, flow
import os
from datetime import timedelta
from prefect.tasks import task_input_hash
from utils.functions import DB_MongoClient
import requests


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

    response = requests.post(
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


@task
def join_information(enclosure_geographic_info, enclosure_meteorological_stations, year: int, enclosureProperties=None):
    joined_enclosure = {
        "year": int(year),
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
def load_enclosures(enclosure: dict, enclosure_id: str):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert enclosures filtered by id and year
    db.Enclosures.update_one(
        {"id": enclosure_id, "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


async def recintos_etl(year: int, enclosure_properties: dict):
    enclosureId = enclosure_properties["id"]
    enclosure_geographic_info = await extract_geographic_info([enclosureId], year)
    enclosure_meteorological_stations = await extract_meteorological_station(enclosureId)
    joined_information = join_information.submit(enclosure_geographic_info, enclosure_meteorological_stations, year, enclosure_properties).result()
    load_enclosures.submit(joined_information, enclosureId).result()


# ------------- TEST -------------

if __name__ == "__main__":
    enclosureIds = [{
        "id": "ES0000010000000000000001",
    }, {
        "id": "ES0000010000000000000002",
    }]
    year = 2019
    recintos_etl(enclosureIds, year)
