from prefect import task, flow, unmapped
import os
from datetime import timedelta
from prefect.tasks import task_input_hash
from utils.functions import DB_MongoClient
import requests
import asyncio
# Get rid of insecure warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@task(retries=2, retry_delay_seconds=3, timeout_seconds=30, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
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


@task(retries=2, retry_delay_seconds=3, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False)
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


@task
def join_information(enclosure_geographic_info, crs, enclosure_meteorological_stations, year: int):
    joined_enclosure = {
        "year": int(year),
        "type": "Feature",
        "geometry": enclosure_geographic_info["geometry"],
        "meteoStation": {
            "idema": enclosure_meteorological_stations["id"],
            "name": enclosure_meteorological_stations["nombre"],
            "distance(km)": enclosure_meteorological_stations["distancia (km)"],
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


@task
def load_enclosures(enclosure: dict, enclosure_id: str):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert enclosures filtered by id and year
    db.Enclosures.update_one(
        {"id": enclosure_id, "year": enclosure["year"]}, {"$set": enclosure}, upsert=True)


@flow(name="recintos_etl")
def recintos_etl(year: int, enclosure_ids: list[str]):
    enclosures_geographic_info = extract_geographic_info(enclosure_ids, year)
    for enclosure_geographic_info in enclosures_geographic_info["features"]:
        try:
            properties = enclosure_geographic_info["properties"]
            enclosure_id = f"{properties['provincia']}-{properties['municipio']}-{properties['agregado']}-{properties['zona']}-{properties['poligono']}-{properties['parcela']}-{properties['recinto']}"
            meteorological_info = extract_meteorological_station(enclosure_id)
            joined_information = join_information(
                enclosure_geographic_info, enclosures_geographic_info["crs"], meteorological_info, year)
            load_enclosures(joined_information, enclosure_id)
        except Exception as e:
            print(e)


# ------------- TEST -------------
async def test_recintos_etl(year: int, enclosure_ids: list[str]):
    enclosure_geographic_info = extract_geographic_info.fn(
        enclosure_ids, year)
    # Run meteorological station extraction in batches of 20
    tasks = []
    for enclosureId in enclosure_ids:
        tasks.append(asyncio.create_task(
            extract_meteorological_station.fn(enclosureId)))
    enclosure_meteorological_stations = await asyncio.gather(*tasks)
    # joined_information = join_information.map(
    #     enclosure_geographic_info["features"], enclosure_meteorological_stations, year, unmapped(enclosure_properties))
    # return joined_information
if __name__ == "__main__":
    enclosureIds = ["45-137-0-0-9-23-1", "45-137-0-0-9-23-2"]
    year = 2022
    asyncio.run(test_recintos_etl(year, enclosureIds))
