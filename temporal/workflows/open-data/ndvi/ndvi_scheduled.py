# This is for common functions to be accepted as module imports
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.functions import DB_MongoClient
from dataclasses import dataclass

from ndvi import Input_Run as NDVIInputRun, NDVIWorkflow, create_sequences, extract, load, transform
from datetime import datetime
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio
from datetime import timedelta
import logging

logging.basicConfig(level=logging.INFO)

@activity.defn()
async def extract_enclosures_ids() -> list[str]:
    mongo_client = DB_MongoClient().connect("common")
    # Extract unique enclosure ids
    result = mongo_client.DigitalTwins.distinct("id")
    if result is None:
        raise Exception("No enclosures found")
    return result

@dataclass
class Input_Last_Known_Date:
    digital_twin_id: str

@activity.defn()
async def extract_last_known_date(input: Input_Last_Known_Date) -> str:
    NDVI_EXTRACT_FIRST_DATE = "01-01-2020"
    mongo_client = DB_MongoClient().connect(input.digital_twin_id)
    # Extract last known date
    last_known_date = mongo_client.NDVI.find_one(sort=[("date", -1)])
    if last_known_date is None:
        return NDVI_EXTRACT_FIRST_DATE
    # return date + 1 day
    return (last_known_date["date"] + timedelta(days=1)).strftime("%d-%m-%Y")

@workflow.defn
class NDVIScheduledWorkflow:
    @workflow.run
    async def run(self) -> None:
        date_end = workflow.now().strftime("%d-%m-%Y")
        enclosures_ids = await workflow.execute_activity(extract_enclosures_ids,
                                                   start_to_close_timeout=timedelta(seconds=10),
                                                   retry_policy=RetryPolicy(maximum_attempts=2))
        # Create new list with dates that goes from year to year for each enclosure till date_end
        digital_twin_ids_new = []
        for digital_twin_id in enclosures_ids:
            digital_twin_ids_new.append({"digital_twin_id": digital_twin_id,
                                      "date_init": await workflow.execute_activity(extract_last_known_date, Input_Last_Known_Date(digital_twin_id),
                                                                             start_to_close_timeout=timedelta(seconds=10),
                                                                             retry_policy=RetryPolicy(maximum_attempts=2))})

        await workflow.execute_child_workflow(NDVIWorkflow, NDVIInputRun(digital_twin_ids_new, date_end), 
                                                                id=f"ndvi-workflow",
                                                                run_timeout=timedelta(seconds=60 * 30),
                                                                retry_policy=RetryPolicy(maximum_attempts=1))

async def main():
    # Get the last week of data
    client = await Client.connect("localhost:7233", namespace="open-data")
    async with Worker(client,
                      task_queue="ndvi-task-queue-1",
                      workflows=[NDVIWorkflow, NDVIScheduledWorkflow],
                      activities=[create_sequences, extract, transform, load, extract_enclosures_ids, extract_last_known_date]):
        await client.execute_workflow(
                NDVIScheduledWorkflow.run,
                id=f"ndvi-scheduled-workflow",
                task_queue="ndvi-task-queue-1",
                retry_policy=RetryPolicy(maximum_attempts=1)
            )
    pass


# Test and debug the flow locally
if __name__ == "__main__":
    asyncio.run(main())
