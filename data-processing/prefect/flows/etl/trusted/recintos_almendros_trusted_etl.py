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
                       sheet_name="Tratamientos", na_values=[''])
    df2 = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                        sheet_name="Parcelas", na_values=[''])
    return df, df2


@task
def transform(df: pd.DataFrame):
    logger = get_run_logger()
    print("processing data")
    logger.info("processing data")
    # Change column names
    try:
        df.columns = ["harvestYear", "harvestInitDate", "phytosanitaryId", "phytosanitaryName", "phytosanitaryFormula", "plagueTreatmentEffectsId", "plagueEffects", "plagueTreatmentWeedsId", "secUserName", "secUserNIF", "secUserId", "parcelProvinceId", "parcelMunicipalityId",
                      "parcelPolygonId", "parcelId", "parcelEnclosureId", "parcelGeographicSpot", "parcelAggregatedId", "parcelZoneId", "parcelHarvestPACCode", "parcelHavestPACCropTree", "broth", "doseKind", "doseUnit", "treatedArea", "phytosanitaryQuantityMovement", "safePeriodMovement", "doseMovement", "parcelArea", "parcelAreaSIGPAC", "parcelVulnerableArea", "parcelSIGPACCode"]
    except Exception as e:
        # Finish flow with error
        raise ValueError("Error changing column names: ", e)
    # Hide sensitive data
    df = df.drop(columns=["secUserNIF"])
    # Validate data
    # TODO: add rules to validate the data
    # Modify data
    # Thanks to Jupyter Notebook, I found out that some number columns are being read as objects
    # Trim spaces
    df['parcelAggregatedId'].replace(r'\s*$', 0, regex=True, inplace=True)
    df['parcelEnclosureId'].replace(r'\s*$', 0, regex=True, inplace=True)
    # Convert to int
    df['parcelAggregatedId'] = df['parcelAggregatedId'].astype(str).astype(int)
    df['parcelEnclosureId'] = df['parcelEnclosureId'].astype(str).astype(int)
    # Trim spaces from strings
    df = df.apply(lambda x: x.str.strip() if x.dtype == "object" else x)
    # Convert strings to uppercase
    df["secUserName"] = df["secUserName"].str.upper()
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
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists("trusted-zone"):
        minio_client.make_bucket("trusted-zone")
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
    df, df2 = extract()
    processed_data, data_year = transform(df)
    load(processed_data, data_year)


if __name__ == "__main__":
    recintos_almendros_refined_etl()
