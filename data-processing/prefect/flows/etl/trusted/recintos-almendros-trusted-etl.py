import os
from prefect import flow, task, get_run_logger
from minio import Minio
import pandas as pd
import io

FILE_NAME = "Recintos_Almendros_Cercanos_y_Otros_Cultivos.xlsx"


@task
def extract():
    logger = get_run_logger()
    # Connect to MinIO
    # TODO: use secrets cause it's not working
    ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT")
    SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT")
    MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST")
    minio_client = Minio(MINIO_HOST, access_key=ACCESS_ROOT,
                         secret_key=SECRET_ROOT, secure=False)

    print("extracting data")
    logger.info("extracting data")
    # Get pistacho.json from MinIO and deserialize it
    data = minio_client.get_object(
        "landing-zone", FILE_NAME).read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Tratamientos")
    return df


@task
def transform(df):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    # Change column names
    df.columns = ["harvestYear", "harvestInitDate", "phytosanitaryId", "phytosanitaryName", "phytosanitaryFormula", "plagueTreatmentEffectsId", "plagueEffects", "plagueTreatmentWeedsId", "secUserName", "secUserNIF", "secUserId", "parcelProvinceId", "parcelMunicipalityId",
                  "parcelPolygonId", "parcelId", "parcelEnclosureId", "parcelAggregatedId", "parcelZoneId", "parcelGeographicSpot", "parcelHarvestPACCode", "parcelHavestPACCropTree", "broth", "doseKind", "doseUnit", "treatedArea", "phytosanitaryQuantityMovement", "safePeriodMovement", "doseMovement", "parcelArea", "parcelAreaSIGPAC", "parcelVulnerableArea", "parcelSIGPACCode"]
    # Hide sensitive data
    df = df.drop(columns=["secUserNIF"])
    # Validate data
    # TODO: add rules to validate the data
    # Modify data
    # df["secUserName"] = df["secUserName"].str.replace('[^a-zA-Z0-9\s]+', '', regex=True) NOTE: Is this okey?
    df["secUserName"] = df["secUserName"].str.upper()
    # Convert back to csv
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


@task
def load(processed_data, data_year):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")
    # Connect to MinIO
    ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT")
    SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT")
    MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST")
    minio_client = Minio(MINIO_HOST, access_key=ACCESS_ROOT,
                         secret_key=SECRET_ROOT, secure=False)
    # Convert processed data to bytes
    processed_data_bytes = io.BytesIO()
    processed_data.to_excel(processed_data_bytes, index=False)
    processed_data_bytes.seek(0)
    # Store processed data with metadata in MinIO
    minio_client.put_object(
        "trusted-zone",
        f"ERP/7eData/{data_year}/{FILE_NAME}",
        processed_data_bytes,
        length=processed_data_bytes.getbuffer().nbytes,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata={
            "source": "7eData",
            "type": "raw"
        }
    )


@flow(name="recintos_almendros_refined_etl")
def recintos_almendros_refined_etl():
    df = extract()
    processed_data, data_year = transform(df)
    load(processed_data, data_year)


if __name__ == "__main__":
    recintos_almendros_refined_etl()
