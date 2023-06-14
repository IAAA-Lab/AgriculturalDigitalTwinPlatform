from prefect import task
from prefect.tasks import task_input_hash
from datetime import timedelta
import os
from utils.functions import DB_MongoClient
import pandas as pd
import requests
import asyncio
# Get rid of insecure warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@task(tags=["agroslab"], retries=1, retry_delay_seconds=3, timeout_seconds=30, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=10), refresh_cache=False, name="extract_user_info")
def extract(user_id: str, year: int, enclosure_ids: list[str]) -> dict:

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "info",
        "year": str(year),
        "user": user_id,
        "ids": enclosure_ids
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, headers=headers, json=body, timeout=29)
    if response.status_code != 200:
        raise Exception(
            f"Error getting user info for user_id: {user_id} - request: {response.text}")
    return response.json()


@task(name="transform-user-info")
def transform(crops: dict, date: str):
    crops_out = []
    phytosanitaries_out = []
    fertilizers_out = []
    for crop in crops["respuesta"]:
        identifiers = crop["identificadores"]
        enclosure_id = f"{identifiers['provincia']}-{identifiers['municipio']}-{identifiers['agregado']}-{identifiers['zona']}-{identifiers['poligono']}-{identifiers['parcela']}-{identifiers['recinto']}"
        crops_out.append({
            "enclosureId": enclosure_id,
            "date": pd.to_datetime(date),
            "area": crop["Cultivos"][0]["Superficie (Ha)"],
            "production": crop["Cultivos"][0]["Produccion (Kg)"],
            "performance": crop["Cultivos"][0]["Rendimiento (Kg/Ha)"],
            "harvest": crop["Cultivos"][0]["Cosecha"],
        })

        for phytosanitary in crop["Fitosanitarios"]:
            phytosanitaries_out.append({
                "enclosureId": enclosure_id,
                "activity": "TRATAMIENTO FITOSANITARIO",
                "properties": {
                    "date": pd.to_datetime(phytosanitary["FechaInicio"]),
                    "dateEnd": pd.to_datetime(phytosanitary["FechaFinal"]),
                    "phytosanitary": {
                        "name": phytosanitary["ProductoFitosanitario"],
                        "formula": phytosanitary["MateriaActiva"],
                    },
                    "plague": {
                        "name": phytosanitary["Plaga"],
                    }
                }
            })

        for fertilizer in crop["Fertilizantes"]:
            fertilizers_out.append({
                "enclosureId": enclosure_id,
                "activity": "FERTILIZACION",
                "properties": {
                    "date": pd.to_datetime(fertilizer["FechaInicio"]),
                    "quantity": fertilizer["Cantidad"],
                    "fertilizer": {
                        "name": fertilizer["Fertilizante"],
                        "nitrogen": fertilizer["Nitrogeno"],
                    }
                }
            })
    return crops_out, phytosanitaries_out, fertilizers_out


@task(name="load-user-info")
def load(crops: list[dict], phytosanitaries: list[dict], fertilizers: list[dict]):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    if len(crops) > 0:
        db.Crops.insert_many(crops)
    if len(phytosanitaries) > 0:
        db.Activities.insert_many(phytosanitaries)
    if len(fertilizers) > 0:
        db.Activities.insert_many(fertilizers)


def recintos_user_info_etl(user_id: str, date: str, enclosure_ids: list[str]):
    year = pd.to_datetime(date).year
    crops = extract(user_id, year, enclosure_ids)
    crops, phytosanitaries, fertilizers = transform(
        crops, date)
    load(crops, phytosanitaries, fertilizers)

# ------------- TEST -------------

if __name__ == "__main__":
    user_id = "901046400000000010"
    date = "2021-01-01"
    enclosure_ids = ["50-99-0-0-2-204-1"]
    asyncio.run(recintos_user_info_etl(user_id, date, enclosure_ids))
