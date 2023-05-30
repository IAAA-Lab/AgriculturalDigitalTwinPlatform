import io
import json
import re
import pandas as pd
import pandera as pa
from prefect import task, flow
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants

BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task
def extract(file_name: str) -> dict:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, file_name).read()
    return pd.read_parquet(io.BytesIO(data))


@task
def transform(df: pd.DataFrame) -> str:
    # Convert to json but maintain date in datetime format
    return df.to_json(orient="records", date_format="iso")


@task
def load(activities: str):
    activities = json.loads(activities)
    # Convert date to datetime
    for activity in activities:
        activity["date"] = pd.to_datetime(activity["date"])
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Insert enclosures filtered by id and year
    db.Activities.insert_many(activities)


@flow(name="activities_dt_etl")
def activities_dt_etl(file_name: str):
    df = extract(file_name)
    activities = transform(df)
    load(activities)

# ----------- TEST -----------


def test_activities_dt_etl(file_name: str):
    df = extract.fn(file_name)
    activities = transform.fn(df)
    load.fn(activities)


if __name__ == "__main__":
    test_activities_dt_etl("ERP/PYSTACIL/2022/PISTACYL_2019-2020-2021.parquet")
