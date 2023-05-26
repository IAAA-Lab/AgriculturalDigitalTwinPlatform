import asyncio
from prefect import task, flow, get_run_logger
import os
from datetime import timedelta
from prefect.tasks import task_input_hash
import requests as request
import pandas as pd
from utils.functions import DB_MongoClient


@task(retries=3, retry_delay_seconds=10, timeout_seconds=60, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=7), refresh_cache=False)
async def extract_ndvi(enclosure_id: str, date_init: str, date_end: str):
    await asyncio.sleep(0.5)

    AGROSLAB_TELEDETECTION_URL = os.environ.get("AGROSLAB_TELEDETECTION_URL")
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")

    body = {
        "operation": "getndviindexmeanvaluezone",
        # Date format: DD-MM-YYYY
        "initdate": date_init,
        "enddate": date_end,
        "id": enclosure_id
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    try:
        # TODO: verify=True when we have a valid certificate
        response = request.post(
            AGROSLAB_TELEDETECTION_URL, headers=headers, json=body, verify=False, timeout=60)
        if response.status_code != 200:
            logger = get_run_logger()
            logger.error(
                f"Error getting ndvi for enclosureId - request: {enclosure_id} - {response.text}")
            return None
        # Get the latest ndvi value
        ndvi = response.json()
        return ndvi
    except Exception as e:
        logger = get_run_logger()
        logger.error(
            f"Error getting ndvi for enclosureId - request: {enclosure_id} - {e}")
    return None


@task
async def transform_ndvi(ndvi_list, enclosure_id: str):
    ndvi = ndvi_list["respuesta"]
    ndvi_list = []
    for ndvi_item in ndvi:
        for key, value in ndvi_item.items():
            # Key %d-%m-%Y to %Y-%m-%d
            datetime = pd.to_datetime(key, format="%d-%m-%Y")
            ndvi_list.append(
                {"date": datetime, "value": value, "enclosureId": enclosure_id})
    return ndvi_list


@task
async def load_ndvi(ndvi_list: list):
    db = DB_MongoClient().connect()
    db.NDVI.insert_many(ndvi_list)


@flow(name="ndvi_etl")
async def ndvi_etl(enclosure_id: str, date_init: str, date_end: str):
    # Date is in format DD-MM-YYYY
    # Extract ndvi in blocks of 1 year max (365 days) to avoid overloading the server
    date_init = pd.to_datetime(date_init, format="%d-%m-%Y")
    date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
    while date_init < date_end:
        date_end_block = date_init + timedelta(days=365)
        if date_end_block > date_end:
            date_end_block = date_end
        ndvi_list = await extract_ndvi(enclosure_id, date_init.strftime(
            "%d-%m-%Y"), date_end_block.strftime("%d-%m-%Y"))
        if ndvi_list is not None:
            ndvi_list = await transform_ndvi(ndvi_list, enclosure_id)
            if len(ndvi_list) > 0:
                await load_ndvi(ndvi_list)
        date_init = date_end_block

# -------------------- TEST --------------------


async def test_ndvi_etl(enclosure_id: str, date_init: str, date_end: str):
    date_init = pd.to_datetime(date_init, format="%d-%m-%Y")
    date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
    while date_init < date_end:
        date_end_block = date_init + timedelta(days=365)
        if date_end_block > date_end:
            date_end_block = date_end
        ndvi_list = await extract_ndvi.fn(enclosure_id, date_init.strftime(
            "%d-%m-%Y"), date_end_block.strftime("%d-%m-%Y"))
        if ndvi_list is not None:
            ndvi_list = await transform_ndvi.fn(ndvi_list, enclosure_id)
            if len(ndvi_list) > 0:
                await load_ndvi.fn(ndvi_list)
        date_init = date_end_block

if __name__ == "__main__":
    enclosure_id = "47-96-0-0-5-20-1"
    date_init = "01-01-2020"
    date_end = "01-01-2023"
    asyncio.run(test_ndvi_etl(enclosure_id, date_init, date_end))
