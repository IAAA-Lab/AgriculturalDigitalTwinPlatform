from prefect import task, flow
import io
import pandas as pd
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
import sys
sys.path.append('/utils')


FILE_PATH = f"ERP/unknown"
FILE_NAME = "cultivos_identificadores.parquet"
BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task
def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, f"{FILE_PATH}/{FILE_NAME}").read()
    return pd.read_parquet(io.BytesIO(data))


@task
def transform(df: pd.DataFrame):
    return df.to_dict("records")


@task
def load(crops: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert crops
    for crop in crops:
        db.Enclosures.update_many(
            {"properties.crop.id": str(crop["id"])}, {"$set": {
                "properties.crop": crop
            }})


@flow(name="cultivos_identificadores_dt_etl")
def cultivos_identificadores_dt_etl():
    df = extract()
    crops = transform(df)
    load(crops)

# ------------------ TEST ------------------

# Test and debug the flow locally
# NOTE: .fn() executes the flow as a normal python function without the need to register it on Prefect server


def cultivos_identificadores_dt_etl_test():
    df = extract.fn()
    crops = transform.fn(df)
    load.fn(crops)


if __name__ == "__main__":
    cultivos_identificadores_dt_etl_test()
