import json

import io
import os
from prefect import flow, task, get_run_logger
from minio import Minio

FILE_NAME = "pistacho.json"


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
    # Hide sensitive data
    json_data['Farm']['HeatlhAdvisor'] = replace_json_values(
        json_data['Farm']['HeatlhAdvisor'], "NIF_Code", "---")
    # Validate data
    # TODO: add rules to validate the data
    # Modify data

    # Convert back to JSON string
    return json.dumps(json_data)


@task
def load(processed_data):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")
    # Connect to MinIO
    ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT")
    SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT")
    MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST")
    minio_client = Minio(MINIO_HOST, access_key=ACCESS_ROOT,
                         secret_key=SECRET_ROOT, secure=False)
    processed_data_bytes = io.BytesIO(processed_data.encode("utf-8"))
    # Store processed data with metadata in MinIO
    minio_client.put_object(
        "refined-zone",
        f"ERP/unknown/{FILE_NAME}",
        processed_data_bytes,
        len(processed_data),
        content_type="application/json",
        metadata={
            # "source": "7eData", -- NOTE: already in metadata from landing-zone to raw-zone
            # "date": "2021-05-01", -- NOTE: already in metadata from landing-zone to raw-zone
            "type": "raw",
            "description": "Pistachio raw data containing farmholders, healthadvisors, healthapplicators and static parcel information",
        },
    )


@flow(name="pistacho_refined_etl")
def pistacho_etl():
    json_data = extract()
    processed_data = transform(json_data)
    load(processed_data)


if __name__ == "__main__":
    pistacho_etl()


# ---------------------------------------------------------- #
#  # Connect to MongoDB
#     mongo_client = MongoClient(
#         "---",
#     )

#     # Get MongoDB database and collection
#     db = mongo_client["---"]
#     collection = db["---"]

#     # Store processed data in MongoDB
#     collection.insert_one(processed_data)
