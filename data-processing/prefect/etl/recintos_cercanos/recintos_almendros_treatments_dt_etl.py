import io
import os

from utils.constants import Constants
import pandas as pd
from prefect import flow, task, get_run_logger

from utils.functions import DB_MinioClient, DB_MongoClient

BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task(name="extract_recintos_almendros_tratamientos_dt_etl")
def extract(file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()

    data = minio_client.get_object(
        BUCKET_FROM_NAME, file_name).read()
    df = pd.read_parquet(io.BytesIO(data))
    return df


@task(name="transform_recintos_almendros_tratamientos_dt_etl")
def transform(df: pd.DataFrame):
    # Convert to Digital Twin domain
    treatments = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"
        # Get phytosanitaries
        phytosanitary = {
            "id": str(row.phytosanitaryId),
            "name": row.phytosanitaryName,
            "formula": row.phytosanitaryFormula,
        }

        plague = {
            "id": row.plagueTreatmentEffectsId,
            "name": row.plagueEffects,
        }

        healthAgent = {
            "id": row.secUserId,
            "name": row.secUserName,
        }

        treatment = {
            "enclosureId": enclosureId,
            "date": pd.to_datetime(row.harvestInitDate),
            "broth": str(row.broth),
            "doseKind": row.doseKind,
            "doseUnit": row.doseUnit,
            "doseMovement": row.doseMovement,
            "safePeriod": row.safePeriodMovement,
            "quantity": row.phytosanitaryQuantityMovement,
            "healthAgent": healthAgent,
            "plague": plague,
            "phytosanitary": phytosanitary,
        }

        treatments.append(treatment)
    return treatments


@task(name="load_recintos_almendros_tratamientos_dt_etl")
def load(treatments):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    for treatment in treatments:
        db.Treatments.update_one({
            "enclosureId": treatment["enclosureId"], "date": treatment["date"], "phytosanitary.id": treatment["phytosanitary"]["id"], "plague.id": treatment["plague"]["id"]
        }, {"$set": treatment}, upsert=True)


@flow(name="recintos_almendros_treatments_dt_etl")
def recintos_almendros_treatments_dt_etl(file_name: str):
    df = extract(file_name)
    treatments = transform(df)
    load(treatments)


if __name__ == "__main__":
    recintos_almendros_treatments_dt_etl()
