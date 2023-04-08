import io
import os
import pandas as pd
from prefect import flow, task, get_run_logger
from minio import Minio
from pymongo import MongoClient

from etl.utils.functions import DB_MinioClient


YEAR = 2022
FILE_PATH = f"ERP/7eData/{YEAR}"
FILE_NAME = "Recintos_Almendros_Cercanos_y_Otros_Cultivos_2_TRATAMIENTOS_2022.xlsx"


@task
def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()

    data = minio_client.get_object(
        "trusted-zone", f"{FILE_PATH}/{FILE_NAME}").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1")
    return df


@task
def transform_tratamientos(df: pd.DataFrame):
    # Convert to Digital Twin domain
    ## Loop through the rows using intertuples()
    # phytosanitaries = []
    # plagues = []
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

        # phytosanitaries.append(phytosanitary)
        # plagues.append(plague)
        treatments.append(treatment)
    return treatments

@task
def load(treatments):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    print(MONGODB_DB)
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]

    # Insert data
    # for phytosanitary in phytosanitaries:
    #     db.Phytosanitaries.update_one({"id": phytosanitary["id"]}, {
    #                                   "$set": phytosanitary}, upsert=True)

    # for plague in plagues:
    #     db.Plagues.update_one({"id": plague["id"]}, {
    #                           "$set": plague}, upsert=True)

    for treatment in treatments:
        db.Treatments.update_one({
            "enclosureId": treatment["enclosureId"], "date": treatment["date"], "phytosanitary.id": treatment["phytosanitary"]["id"], "plague.id": treatment["plague"]["id"]
        }, {"$set": treatment}, upsert=True)


@flow(name="recintos_almendros_tratamientos_dt_etl")
def recintos_almendros_tratamientos_dt_etl():
    df = extract()
    treatments = transform_tratamientos(
        df)
    load(treatments)


if __name__ == "__main__":
    recintos_almendros_tratamientos_dt_etl()
