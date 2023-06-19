import io
import json
from etl.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
import pandas as pd
from prefect import task, flow
from etl.recintos_cercanos.recintos_etl import recintos_etl
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
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
def activities_dt_etl(file_name: str):
    df = extract.submit(file_name).result()
    activities = transform.submit(df).result()
    load.submit(activities).result()
    # Get unique enclosures ids
    enclosures_ids = list(set([activity["enclosureId"]
                          for activity in activities]))
    # Run recintos_etl
    recintos_etl(2022, enclosures_ids)
    # Asynchronously extract the rest of the information
    cultivos_identificadores_dt_etl()


# ----------- TEST -----------
def test_activities_dt_etl(file_name: str):
    df = extract.fn(file_name)
    activities = transform.fn(df)
    load.fn(activities)
    enclosures_ids = list(set([activity["enclosureId"]
                          for activity in activities]))
    # Run recintos_etl
    recintos_etl(2022, enclosures_ids)


if __name__ == "__main__":
    asyncio.run(activities_dt_etl(
        "ERP/PYSTACIL/2022/PISTACYL_2019-2020-2021.parquet"))
