# This is for common functions to be accepted as module imports
from dataclasses import dataclass
import itertools
from temporalio import activity, workflow
with workflow.unsafe.imports_passed_through():
    import pandas as pd
    import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.functions import DB_MongoClient

from temporalio.client import Client
from temporalio.common import RetryPolicy
import asyncio
from datetime import timedelta
import logging

logging.basicConfig(level=logging.ERROR)

@dataclass
class Input_Extract:
    digital_twin_id: str
    date_init: str
    date_end: str

@activity.defn()
async def extract(input: Input_Extract) -> tuple[dict, str]:
    from aiohttp_client_cache import CachedSession, SQLiteBackend
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_TELEDETECTION_URL = os.environ.get("AGROSLAB_TELEDETECTION_URL")
    body = {
        "operation": "getndviindexmeanvaluezone",
        # Date format: DD-MM-YYYY
        "initdate": input.date_init,
        "enddate": input.date_end,
        "id": input.digital_twin_id
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    async with CachedSession(cache=SQLiteBackend(expire_after=60*60*24)) as session: # Works if activity is local
    # async with aiohttp.ClientSession() as session:
        async with session.post(AGROSLAB_TELEDETECTION_URL, json=body, headers=headers, ssl=False) as resp:
            if resp.status != 200:
                raise Exception(f"Status code: {resp.status} - {input.digital_twin_id} -> Response: {await resp.text()}")
            data = await resp.json(content_type="application/json")
            return data, input.digital_twin_id

@dataclass
class Input_Transform:
    ndvi_list: dict
    digital_twin: str

@activity.defn()
async def transform(input: Input_Transform) -> list[dict]:
    ndvi = input.ndvi_list["respuesta"]
    ndvi_list = []
    for ndvi_item in ndvi:
        for key, value in ndvi_item.items():
            # Key %d-%m-%Y to %Y-%m-%d
            datetime = pd.to_datetime(key, format="%d-%m-%Y")
            ndvi_list.append({"date": datetime.strftime("%Y-%m-%d"), "value": value, "enclosureId": input.digital_twin})
    return ndvi_list

@dataclass
class Input_Load:
    ndvi_list: list[dict]

@activity.defn()
async def load(input: Input_Load) -> None:
    # Convert date to datetime
    for ndvi_item in input.ndvi_list:
        ndvi_item["date"] = pd.to_datetime(ndvi_item["date"], format="%Y-%m-%d")
    # Group by digital_twin_id
    input.ndvi_list = sorted(input.ndvi_list, key=lambda x: x["enclosureId"])
    input.ndvi_list = [{"digital_twin_id": key, "ndvi": list(group)} for key, group in itertools.groupby(input.ndvi_list, key=lambda x: x["enclosureId"])]
    # Load to MongoDB
    for digital_twin in input.ndvi_list:
        mongo_client = DB_MongoClient().connect(digital_twin["digital_twin_id"])
        mongo_client.NDVI.insert_many(digital_twin["ndvi"])

@dataclass
class Input_Sequence:
    digital_twins_init: list[dict]
    date_end: str

@activity.defn()
async def create_sequences(input: Input_Sequence) -> list[dict]:
    ndvi_req_list = []
    date_end = input.date_end
    digital_twins_init = input.digital_twins_init
    for digital_twin in digital_twins_init:
        date_init = pd.to_datetime(
            digital_twin["date_init"], format="%d-%m-%Y")
        date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
        while date_init < date_end:
            date_end_block = pd.to_datetime(
                date_init, format="%d-%m-%Y") + timedelta(days=365)
            if date_end_block > date_end:
                date_end_block = date_end
            ndvi_req_list.append(
                {"digital_twin_id": digital_twin["digital_twin_id"], "date_init": date_init.strftime("%d-%m-%Y"), "date_end": date_end_block.strftime("%d-%m-%Y")})
            date_init = date_end_block
    return ndvi_req_list

@dataclass
class Input_Run:
    digital_twins_init: list[dict]
    date_end: str

@workflow.defn
class NDVIWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        # Date is in format DD-MM-YYYY
        # Create new list with dates that goes from year to year for each enclosure till date_end
        ndvi_req_list = await workflow.execute_local_activity(create_sequences, Input_Sequence(input.digital_twins_init, input.date_end),
                                                                start_to_close_timeout=timedelta(seconds=1),
                                                                retry_policy=RetryPolicy(maximum_attempts=1))
        
        BATCH_SIZE = 10
        for i in range(0, len(ndvi_req_list), BATCH_SIZE):
            batch = ndvi_req_list[i:i+BATCH_SIZE]
            tasks = [workflow.execute_activity(extract, Input_Extract(item["digital_twin_id"], item["date_init"], item["date_end"]),
                                                                             start_to_close_timeout=timedelta(seconds=30),
                                                                             retry_policy=RetryPolicy(maximum_attempts=2)) for item in batch]
            res_futures = await asyncio.gather(*tasks, return_exceptions=True)
            await asyncio.sleep(1)
            for res in res_futures:
                if isinstance(res, Exception):
                    logging.error(f"Error getting ndvi - {type(res)}")
                    continue
                ndvi_raw, digital_twin = res
                if "error" in ndvi_raw:
                    logging.error(f"Error getting ndvi for enclosureId: {digital_twin} - {ndvi_raw['error']}")
                    continue
                if len(ndvi_raw["respuesta"]) == 0:
                    continue
                ndvi_list = await workflow.execute_activity(transform, Input_Transform(ndvi_raw, digital_twin),
                                                                             start_to_close_timeout=timedelta(seconds=10),
                                                                             retry_policy=RetryPolicy(maximum_attempts=2))
                await workflow.execute_activity(load, Input_Load(ndvi_list),
                                                     start_to_close_timeout=timedelta(seconds=10),
                                                     retry_policy=RetryPolicy(maximum_attempts=2))

async def main(digital_twins_init: list[dict], date_end: str):
    client = await Client.connect("localhost:7233")
    # async with Worker(client,
    #                   task_queue="ndvi-task-queue",
    #                   workflows=[NDVIWorkflow],
    #                   activities=[extract, transform, load]):
    await client.execute_workflow(
            NDVIWorkflow.run,
            Input_Run(digital_twins_init, date_end),
            id=f"ndvi-workflow", # Use the first digital_twin as id
            task_queue="ndvi-task-queue",
            retry_policy=RetryPolicy(maximum_attempts=1)
        )


# -------------------- TEST --------------------
if __name__ == "__main__":
    digital_twins_init = [{"digital_twin": "44-254-0-0-11-341-12", "date_init": "01-01-2020"}]
    date_end = "01-01-2023"
    asyncio.run(main(digital_twins_init, date_end))
