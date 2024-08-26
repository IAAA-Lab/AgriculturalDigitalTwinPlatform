from dataclasses import dataclass
from datetime import timedelta
from typing import Tuple
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
# This is for common functions to be accepted as module imports
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
with workflow.unsafe.imports_passed_through():
    import pandas as pd
    from common.schemas import harvest_schema
from common.functions import DB_MinioClient
from common.constants import Constants
import io
import re
import asyncio

BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value
BUCKET_TO_NAME = Constants.STORAGE_TRUSTED_ZONE.value

@dataclass
class Input_Extract:
    digital_twin_id: str
    file_name: str

@activity.defn(name="extract_yield_activities_trusted")
async def extract(input: Input_Extract) -> Tuple[list[dict], str, dict]:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, f"{input.digital_twin_id}/{input.file_name}").read()
    # stat = minio_client.stat_object(BUCKET_FROM_NAME, f"{input.digital_twin_id}/{input.file_name}")
    harvest = pd.read_json(io.BytesIO(data), orient="records").to_dict(orient="records")
    return harvest, re.split(r"\.", input.file_name)[0], {
        "digital-twin-id": input.digital_twin_id,
        "type": "yield"
    }

@dataclass
class Input_Clean:
    digital_twin_id: str
    harvest: list[dict]

@activity.defn(name="clean_yield_activities_trusted")
async def clean(input: Input_Clean) -> list[dict]:
    # TO dataframe
    harvest = pd.DataFrame(input.harvest)
    # Rename columns
    harvest = harvest.rename(columns={
        "id": "digital_twin_id",
        "fecha": "date",
        "cosecha": "yield",
    })
    # Add new column activity
    harvest["activity"] = "harvest"
    # Drop rows with undefined
    harvest = harvest.dropna()
    # Drop duplicates
    harvest = harvest.drop_duplicates()
    return harvest.to_dict(orient="records")

@dataclass
class Input_Validate:
    harvest: list[dict]

@activity.defn(name="validate_yield_activities_trusted")
async def validate(input: Input_Validate) -> list[dict]:
    return harvest_schema.validate(pd.DataFrame(input.harvest)).to_dict(orient="records")

@dataclass
class Input_Transform:
    harvest: list[dict]

@activity.defn(name="transform_yield_activities_trusted")
async def transform(input: Input_Transform) -> bytes:
    # Convert to parquet
    return pd.DataFrame(input.harvest).to_parquet(index=False)

@dataclass
class Input_Load:
    digital_twin_id: str
    processed_data: bytes
    file_name: str
    metadata: dict

@activity.defn(name="load_yield_activities_trusted")
async def load(input: Input_Load) -> None:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists(BUCKET_TO_NAME):
        minio_client.make_bucket(BUCKET_TO_NAME)
    # Store processed data with metadata in MinIO
    file = io.BytesIO(input.processed_data)
    minio_client.put_object(
        BUCKET_TO_NAME,
        f"{input.digital_twin_id}/{input.file_name}.parquet",
        file,
        length=file.getbuffer().nbytes,
        content_type="application/octet-stream",
        metadata=input.metadata
    )
    minio_client.remove_object(BUCKET_FROM_NAME, f"invalid/{input.file_name}.xlsx")

@dataclass
class Input_Run:
    digital_twin_id: str
    file_name: str

@workflow.defn
class YieldTrustedWorkflow():
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        # Define flow
        harvest, file_name, metadata = await workflow.execute_activity(extract, Input_Extract(input.digital_twin_id, input.file_name),
                                                         start_to_close_timeout=timedelta(seconds=15),
                                            retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        validated_data = await workflow.execute_activity(validate, Input_Validate(harvest),
                                                            start_to_close_timeout=timedelta(seconds=15),
                                                            retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        cleaned_data = await workflow.execute_activity(clean, Input_Clean(input.digital_twin_id, validated_data),
                                                        start_to_close_timeout=timedelta(seconds=15),
                                                        retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        transformed_data = await workflow.execute_activity(transform, Input_Transform(cleaned_data),
                                                            start_to_close_timeout=timedelta(seconds=15),
                                                            retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        await workflow.execute_activity(load, Input_Load(input.digital_twin_id, transformed_data, file_name, metadata),
                     start_to_close_timeout=timedelta(seconds=15),
                     retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))

async def main():
    client = await Client.connect("localhost:7233", namespace="47-96-0-0-5-25-1")
    async with Worker(client,
                      task_queue="activites-task-queue",
                      workflows=[YieldTrustedWorkflow],
                      harvest=[extract, transform, load, clean, validate]):
        # Schedule the workflow every Sunday at 00:00
        await client.execute_workflow(
                YieldTrustedWorkflow.run,
                id="activites-task-queue-workflow",
                task_queue="activites-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1),
            )

if __name__ == "__main__":
    # Define flow parameters
    file_name = "FakeCosecha-1"
    # Run flow
    asyncio.run(main())
