import io
import json
import pandas as pd
from prefect import task, flow
from etl.recintos_cercanos.recintos_etl import recintos_etl
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
from prefect.deployments import run_deployment
import asyncio


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task
def extract(file_name: str) -> dict:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, file_name).read()
    return pd.read_parquet(io.BytesIO(data))


@task
def transform(df: pd.DataFrame) -> list:
    # Convert to json but maintain date in datetime format
    json_str = df.to_json(orient="records", date_format="iso")
    return json.loads(json_str)


@task
def load(activities: list):
    # Convert date to datetime
    for activity in activities:
        activity["date"] = pd.to_datetime(activity["date"])
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Insert enclosures filtered by id and year
    db.Activities.insert_many(activities)


@flow(name="activities_dt_etl")
async def activities_dt_etl(file_name: str):
    df = extract.submit(file_name)
    activities_future = transform.submit(df)
    load.submit(activities_future)
    # Wait for the activities to be transformed
    activities = activities_future.result()
    # Get unique enclosures ids
    enclosures_ids = list(set([activity["enclosureId"]
                          for activity in activities]))
    # Run the enclosures etl flow for each enclosure asynchronously in batches of 10
    BATCH_SIZE = 20
    for i in range(0, len(enclosures_ids), BATCH_SIZE):
        await asyncio.gather(*[asyncio.create_task(recintos_etl(year=2022, enclosure_properties={"id": enclosure_id})) for enclosure_id in enclosures_ids[i:i+BATCH_SIZE]])
        await asyncio.sleep(1.5)

    # Asynchronously extract the rest of the information
    await run_deployment(
        name="cultivos_identificadores_dt_etl/event-driven")
    await run_deployment(
        name="historical_weather_scheduled_etl/scheduled")
    await run_deployment(
        name="ndvi_scheduled_etl/scheduled")


# ----------- TEST -----------
def test_activities_dt_etl(file_name: str):
    df = extract.fn(file_name)
    activities = transform.fn(df)
    load.fn(activities)
    enclosures_ids = list(set([activity["enclosureId"]
                          for activity in activities]))
    for enclosure_id in enclosures_ids:
        recintos_etl(year=2022, enclosure_properties={"id": enclosure_id})


if __name__ == "__main__":
    asyncio.run(activities_dt_etl(
        "ERP/PYSTACIL/2022/PISTACYL_2019-2020-2021.parquet"))
