from prefect import flow, get_run_logger
import asyncio
import os
from datetime import timedelta
import pandas as pd
from utils.functions import DB_MongoClient
import urllib3
import time
import aiohttp
import requests
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

start_time = time.time()

AGROSLAB_TELEDETECTION_URL = os.environ.get("AGROSLAB_TELEDETECTION_URL")
AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")

async def extract_ndvi(enclosure_id: str, date_init: str, date_end: str, session) -> dict:

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

    return await session.post(AGROSLAB_TELEDETECTION_URL, headers=headers, json=body), enclosure_id

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


async def load_ndvi(ndvi_list: list):
    db = DB_MongoClient().connect()
    db.NDVI.insert_many(ndvi_list)

def break_in_batches(enclosure_ids_init: list[dict], date_end: str):
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
    return ndvi_req_list


@flow
async def ndvi_etl(enclosure_ids_init: list[dict], date_end: str):
    # Date is in format DD-MM-YYYY
    # Create new list with dates that goes from year to year for each enclosure till date_end
    logger = get_run_logger()
    ndvi_req_list = break_in_batches(enclosure_ids_init, date_end)
    
    BATCH_SIZE = 30
    http_client = aiohttp.ClientSession()
    for i in range(0, len(ndvi_req_list), BATCH_SIZE):
        batch = ndvi_req_list[i:i+BATCH_SIZE]
        tasks = [extract_ndvi(enclosure_id["enclosure_id"], enclosure_id["date_init"], enclosure_id["date_end"], http_client) for enclosure_id in batch]
        res_futures = await asyncio.gather(*tasks, return_exceptions=True)
        await asyncio.sleep(2)

        for res in res_futures:
            if isinstance(res, Exception):
                logger.error(f"Error getting ndvi - {type(res)}")
                continue
            ndvi_raw = await res[0].json()
            enclosure_id = res[1]
            if "error" in ndvi_raw:
                logger.error(f"Error getting ndvi for enclosureId: {enclosure_id} - {ndvi_raw['error']}")
                continue
            if len(ndvi_raw["respuesta"]) == 0:
                continue
            ndvi_list = await transform_ndvi(ndvi_raw, enclosure_id)
            await load_ndvi(ndvi_list)
    await http_client.close()


# -------------------- TEST --------------------
if __name__ == "__main__":
    enclosure_ids_init = [{"enclosure_id": "44", "date_init": "01-01-2020"}, {"enclosure_id": "44-254-0-0-11-341-12",
                                                                                                "date_init": "01-01-2020"}]
    date_end = "01-01-2023"
    asyncio.run(ndvi_etl(enclosure_ids_init, date_end))
    print("--- %s seconds ---" % (time.time() - start_time))
