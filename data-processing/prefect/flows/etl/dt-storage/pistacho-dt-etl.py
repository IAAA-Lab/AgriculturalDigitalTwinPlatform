import json

import os
from prefect import flow, task, get_run_logger
from minio import Minio
from pymongo import MongoClient

FILE_NAME = "ERP/unknown/pistacho.json"


def replace_json_values(obj, key, new_value):
    for each in obj:
        each[key] = new_value
    return obj


@task
def extract():
    logger = get_run_logger()
    # Connect to MinIO
    ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT")
    SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT")
    MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST")
    minio_client = Minio(MINIO_HOST, access_key=ACCESS_ROOT,
                         secret_key=SECRET_ROOT, secure=False)

    print("extracting data")
    logger.info("extracting data")
    # Get pistacho.json from MinIO and deserialize it
    pistacho_json_data = minio_client.get_object(
        "trusted-zone", FILE_NAME).read().decode("utf-8")
    pistacho_json = json.loads(pistacho_json_data)
    return pistacho_json


@task
def transform(json_data):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    return json_data


@task
def load(processed_data):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")

    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    mongo_client = MongoClient(MONGODB_HOST)
    # Get MongoDB database and collection
    db = mongo_client["digital_twin_local"]
    collection = db["Test"]
    # Store processed data in MongoDB
    collection.insert_one(processed_data)


@flow(name="pistacho_refined_etl")
def pistacho_dt_etl():
    json_data = extract()
    processed_data = transform(json_data)
    load(processed_data)


if __name__ == "__main__":
    pistacho_dt_etl()


# ---------------------------------------------------------- #
