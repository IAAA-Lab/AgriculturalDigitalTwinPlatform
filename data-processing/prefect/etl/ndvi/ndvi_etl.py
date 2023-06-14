import asyncio
from prefect import task, flow, get_run_logger
import os
from datetime import timedelta
from prefect.tasks import task_input_hash
import pandas as pd
from utils.functions import DB_MongoClient
import requests
import urllib3
import httpx
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


@task(timeout_seconds=60, retry_delay_seconds=5, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=7), refresh_cache=True)
async def extract_ndvi(enclosure_id: str, date_init: str, date_end: str, client) -> dict:
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

    # TODO: verify=True when we have a valid certificate
    response = await client.post(
        AGROSLAB_TELEDETECTION_URL, headers=headers, json=body, timeout=58)
    if response.status_code != 200:
        raise Exception(
            f"Error getting ndvi for enclosureId - request: {enclosure_id} - {response.text}")
    # Get the latest ndvi value
    return response.json(), enclosure_id


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
async def ndvi_etl(enclosure_ids_init: list[dict], date_end: str):
    # Date is in format DD-MM-YYYY
    # enclosure_ids_init: [{"enclosureId": "1", "date_init": "01-01-2020"}]
    # Create new list with dates that goes from year to year for each enclosure till date_end
    ndvi_req_list = []
    for enclosure_id in enclosure_ids_init:
        date_init = pd.to_datetime(
            enclosure_id["date_init"], format="%d-%m-%Y")
        date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
        while date_init < date_end:
            date_end_block = pd.to_datetime(
                date_init, format="%d-%m-%Y") + timedelta(days=365)
            if date_end_block > date_end:
                date_end_block = date_end
            ndvi_req_list.append(
                {"enclosure_id": enclosure_id["enclosure_id"], "date_init": date_init.strftime("%d-%m-%Y"), "date_end": date_end_block.strftime("%d-%m-%Y")})
            date_init = date_end_block
    # Run
    # for nvi_req in ndvi_req_list:
    #     try:
    #         ndvi_raw = await extract_ndvi(nvi_req["enclosure_id"], nvi_req["date_init"], nvi_req["date_end"])
    #         if len(ndvi_raw[0]["respuesta"]) == 0:
    #             continue
    #         ndvi_list = await transform_ndvi(ndvi_raw[0], ndvi_raw[1])
    #         await load_ndvi(ndvi_list)
    #     except Exception as e:
    #         print(e)
    logger = get_run_logger()

    BATCH_SIZE = 2
    client = httpx.AsyncClient(verify=False)
    tasks = []
    for i in range(0, len(ndvi_req_list), BATCH_SIZE):
        batch = ndvi_req_list[i:i+BATCH_SIZE]
        for nvi_req in batch:
            tasks.append(extract_ndvi.fn(nvi_req["enclosure_id"],
                                      nvi_req["date_init"], nvi_req["date_end"], client))
        ndvi_raw_list = await asyncio.gather(*tasks, return_exceptions=True)
        for ndvi_raw in ndvi_raw_list:
            if isinstance(ndvi_raw, Exception):
                logger.error(f"Error getting ndvi: {ndvi_raw}")
                continue
            if len(ndvi_raw[0]["respuesta"]) == 0:
                continue
            ndvi_list = await transform_ndvi(ndvi_raw[0], ndvi_raw[1])
            await load_ndvi(ndvi_list)
        tasks = []
    await client.aclose()


# -------------------- TEST --------------------
if __name__ == "__main__":
    enclosure_ids_init = [{"enclosure_id": "1", "date_init": "01-01-2020"}]
    date_end = "01-01-2021"
    asyncio.run(ndvi_etl(enclosure_ids_init, date_end))
