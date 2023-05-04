from etl.utils.constants import Constants
from etl.utils.functions import DB_MinioClient, DB_MongoClient
import pandas as pd
import io
from prefect import task, flow

FILE_PATH = f"ERP/unknown"
FILE_NAME = "cultivos_identificadores.xlsx"
BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task
def load():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, f"{FILE_PATH}/{FILE_NAME}").read()
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
def load(crops: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Insert crops filtered by id and year
    # db.crops.create_index("id", unique=True)
    for crop in crops:
        db.Enclosures.update_many(
            {"properties.crop.id": crop["id"]}, {"$set": {
                "properties.crop": crop
            }}, upsert=True)


@flow(name="cultivos_identificadores_dt_etl")
def cultivos_identificadores_dt_etl():
    df = load()
    crops = transform(df)
    load(crops)
