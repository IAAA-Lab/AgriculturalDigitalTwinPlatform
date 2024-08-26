from temporalio import activity, workflow
# This is for common functions to be accepted as module imports
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
with workflow.unsafe.imports_passed_through():
    import pandas as pd
from common.functions import DB_MongoClient, DB_MinioClient
from common.constants import Constants
from dataclasses import dataclass
import io
import json
from datetime import datetime, timedelta
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value

@dataclass
class Input_Extract:
    file_name: str
    digital_twin_id: str

@activity.defn(name="extract_activities_dt")
async def extract(input: Input_Extract) -> list[dict]:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, f"{input.digital_twin_id}/{input.file_name}").read()
    # print(pd.read_parquet(io.BytesIO(data)))
    return pd.read_parquet(io.BytesIO(data)).to_dict(orient="records")

# @dataclass
# class Input_Transform:
#     activities: list[dict]

# @activity.defn(name="transform_activities_dt")
# async def transform(input: Input_Transform) -> list[dict]:
#     # Convert to json but maintain date in datetime format
#     json_str = input.activities.to_json(orient="records", date_format="iso")
#     return json.loads(json_str)

@dataclass
class Input_Load:
    digital_twin_id: str
    activities: list[dict]

@activity.defn(name="load_activities_dt")
async def load(input: Input_Load) -> None:
    # Convert date to datetime
    for activity in input.activities:
        activity["date"] = pd.to_datetime(activity["date"])
    # Connect to MongoDB
    db = DB_MongoClient().connect(input.digital_twin_id)
    # Insert enclosures filtered by id and year
    db.Activities.insert_many(input.activities)

@dataclass
class Input_Run:
    file_name: str
    digital_twin_id: str

@workflow.defn
class ActivitiesDTWorkflow():
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        activities = await workflow.execute_activity(extract, Input_Extract(file_name=input.file_name, digital_twin_id=input.digital_twin_id),
                                            start_to_close_timeout=timedelta(seconds=15),
                                            retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        # activities = await workflow.execute_activity(transform, Input_Transform(activities=df),
        #                                                 start_to_close_timeout=timedelta(seconds=15),
        #                                                 retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        if len(activities) > 0:
            await workflow.execute_activity(load, Input_Load(digital_twin_id=input.digital_twin_id, activities=activities),
                                        start_to_close_timeout=timedelta(seconds=15),
                                        retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        

async def main():
    client = await Client.connect("localhost:7233", namespace="47-96-0-0-5-25-1")
    async with Worker(client,
                      task_queue="activites-task-queue",
                      workflows=[ActivitiesDTWorkflow],
                      activities=[extract, load]):
        # Schedule the workflow every Sunday at 00:00
        await client.execute_workflow(
                ActivitiesDTWorkflow.run,
                id="activites-task-queue-workflow",
                task_queue="activites-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1),
            )

if __name__ == "__main__":
    asyncio.run(main())
