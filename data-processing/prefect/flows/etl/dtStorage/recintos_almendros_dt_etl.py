import io
import os
import pandas as pd
from prefect import flow, task, get_run_logger
from minio import Minio
from pymongo import MongoClient


FILE_PATH = "ERP/7eData/2022"
FILE_NAME = "Recintos_Almendros_Cercanos_y_Otros_Cultivos.xlsx"


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
    data = minio_client.get_object(
        "trusted-zone", f"{FILE_PATH}/{FILE_NAME}").read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1")
    # df2 = pd.read_excel(io.BytesIO(data), engine="openpyxl",
    #                     sheet_name="Parcelas")
    df2 = []
    return df, df2


@task
def transform_tratamientos(df: pd.DataFrame):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    # Convert to Digital Twin domain
    # Loop through the rows using intertuples()
    enclosures = []
    phytosanitaries = []
    plagues = []
    treatments = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"
        # Get phytosanitaries
        phytosanitary = {
            "id": row.phytosanitaryId,
            "name": row.phytosanitaryName,
            "formula": row.phytosanitaryFormula,
        }

        plague = {
            "id": row.plagueTreatmentEffectsId,
            "name": row.plagueEffects,
        }

        treatment = {
            "id": row.phytosanitaryId,
            "enclosureId": enclosureId,
            "date": row.harvestInitDate,
            "broth": row.broth,
            "doseKind": row.doseKind,
            "doseUnit": row.doseUnit,
            "doseMovement": row.doseMovement,
            "safePeriod": row.safePeriodMovement,
            "quantity": row.phytosanitaryQuantityMovement,
        }

        healthAgent = {
            "id": row.secUserId,
            "name": row.secUserName,
        }

        enclosure = {
            "id": enclosureId,
            "geographicSpot": row.parcelGeographicSpot,
            "codePAC": row.parcelHarvestPACCode,
        }

        enclosures.append(enclosure)
        phytosanitaries.append(phytosanitary)
        plagues.append(plague)
        treatments.append(treatment)

    # Remove duplicates
    enclosures = [dict(t) for t in {tuple(d.items()) for d in enclosures}]
    phytosanitaries = [dict(t)
                       for t in {tuple(d.items()) for d in phytosanitaries}]
    plagues = [dict(t) for t in {tuple(d.items()) for d in plagues}]
    treatments = [dict(t) for t in {tuple(d.items()) for d in treatments}]
    return enclosures, phytosanitaries, plagues, treatments


@ task
def transform_parcelas(df):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    # Convert to Digital Twin domain

    return df


@task
def load(enclosures, phytosanitaries, plagues, treatments):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")

    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    print(MONGODB_DB)
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]
    # Insert enclosures without duplicates
    # db.Enclosures.create_index("id", unique=True)
    db.Enclosures.insert_many(enclosures, ordered=False)
    # Insert phytosanitaries without duplicates
    # db.Phytosanitaries.create_index("id", unique=True)
    db.Phytosanitaries.insert_many(phytosanitaries, ordered=False)
    # Insert plagues without duplicates
    # db.Plagues.create_index("id", unique=True)
    db.Plagues.insert_many(plagues, ordered=False)
    # Insert treatments without duplicates
    # db.Treatments.create_index("id", unique=True)
    db.Treatments.insert_many(treatments, ordered=False)


@flow(name="recintos_almendros_dt_etl")
def recintos_almendros_dt_etl():
    df, df2 = extract()
    enclosures, phytosanitaries, plagues, treatments = transform_tratamientos(
        df)
    load(enclosures, phytosanitaries, plagues, treatments)
    return enclosures, phytosanitaries, plagues, treatments


if __name__ == "__main__":
    recintos_almendros_dt_etl()
