import io
import os
import time
import requests as request
import pandas as pd
from prefect import flow, task, get_run_logger
from pymongo import MongoClient

from etl.utils.functions import DB_MinioClient

FILE_PATH = f"ERP/unknown"
FILE_NAME = "cultivos_identificadores.xlsx"


@task(retries=3, retry_delay_seconds=20)
def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        "trusted-zone", f"{FILE_PATH}/{FILE_NAME}").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1", na_values=[""])
    return df

@task
def transform(df: pd.DataFrame):
    # Convert to Digital Twin domain
    # Loop through the rows using intertuples()
    crops = []
    for row in df.itertuples():
        # Get enclosures
        crop = {
            "id": row.cropId,
            "name": row.cropName,
            "variety": row.cropVariety,
            # If varietyId is NaN dont include it
            "varietyId": row.cropVarietyId if not pd.isna(row.cropVarietyId) else None,
            "codeType": row.codeType,
            "plantationKind": row.plantationKind,
            "plantationSubKind": row.plantationSubKind,
            # "rainfedOrIrrigated": row.RainfedIrrigated,
        }

        crops.append(crop)

    return crops

@task
def load(crops):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]
    # Insert crops filtered by id and year
    # db.crops.create_index("id", unique=True)
    for crop in crops:
        db.Enclosures.update_many(
            {"properties.crop.id": crop["id"]}, {"$set": {
                "properties.crop": crop
            }}, upsert=True)


@flow(name="cultivos_identificadores_dt_etl")
def cultivos_identificadores_dt_etl():
    df = extract()
    crops = transform(df)
    load(crops)


if __name__ == "__main__":
    cultivos_identificadores_dt_etl()
