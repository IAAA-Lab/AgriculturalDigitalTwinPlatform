
import io
import pandas as pd
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants
from prefect import flow


FILE_PATH = f"ERP/unknown"
FILE_NAME = "cultivos_identificadores.parquet"
BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value



async def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, f"{FILE_PATH}/{FILE_NAME}").read()
    return pd.read_parquet(io.BytesIO(data))


async def transform(df: pd.DataFrame):
    return df.to_dict("records")



async def load(crops: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Add crops properties to "properties" object in Enclosures collection
    for crop in crops:
        db.Enclosures.update_many(
            {"properties.cropId": crop["id"]},
            {"$set": {"properties.cropName": crop["name"]}}
        )

@flow
async def cultivos_identificadores_dt_etl():
    df = await extract()
    crops = await transform(df)
    await load(crops)

# ------------------ TEST ------------------

if __name__ == "__main__":
    cultivos_identificadores_dt_etl()
