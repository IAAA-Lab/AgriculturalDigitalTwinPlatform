import os
import re
from prefect import flow, task, get_run_logger
from minio import Minio
import pandas as pd
import io

from etl.utils.functions import DB_MinioClient

METADATA_KEY = "x-amz-meta-type"
METADATA_VAL = "excel_almendros_cercanos"
BUCKET_FROM_NAME = "landing-zone"
BUCKET_TO_NAME = "trusted-zone"

@task
def extract_objects_to_process() -> list:
    logger = get_run_logger()
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    objects_name = []
    for obj in minio_client.list_objects(BUCKET_FROM_NAME, include_user_meta=True):
        stat = minio_client.stat_object(BUCKET_FROM_NAME, obj.object_name)
        if stat.metadata.get(METADATA_KEY) == METADATA_VAL:
            objects_name.append(obj.object_name)
    # Read object and convert to dataframe
    objects = []
    for object_name in objects_name:
            data = minio_client.get_object(BUCKET_FROM_NAME, object_name).read()
            try:
                dfParcels = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                                sheet_name="Parcelas", na_values=[''])
            except Exception as e:
                logger.error("Error reading object: ", e)
            try:
                dfTreatments = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                                sheet_name="Tratamientos", na_values=[''])
            except Exception as e:
                logger.error("Error reading object: ", e)
            objects.append({
                "treatments": dfTreatments,
                "parcels": dfParcels,
                "name": re.split(r"\.", object_name)[0]
            })
        
    return objects

@task
def transform_treatments(df: pd.DataFrame):
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
    df.columns = df.columns.str.replace('^ +| +$', '')
    # Convert strings to uppercase
    df["secUserName"] = df["secUserName"].str.upper()
    # Convert string to datetime and format it
    df["harvestInitDate"] = pd.to_datetime(df["harvestInitDate"])
    df["harvestInitDate"] = df["harvestInitDate"].dt.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
    # Get data year
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


@task
def transform_parcels(df: pd.DataFrame):
    logger = get_run_logger()
    print("processing parcels data")
    logger.info("processing parcels data")
    # Modify data
    ## Trim spaces
    df.columns = df.columns.str.replace('^ +| +$', '')
    ## Convert strings to int in columns "Recinto" and "Agregado"
    columns = ["Recinto", "Agregado"]
    for column in columns:
        ### Remove spaces from columns
        df.columns = df.columns.astype(str).str.replace(' ', '').str.strip()
        ### Convert columns Recinto and Agregado to int
        df[column] = pd.to_numeric(df[column], downcast='integer', errors='coerce')
        ### Remove rows with NaN in Recinto
        df = df[df[column].notna()]
        ### Convert columns Recinto to int
        df[column] = df[column].astype(int)
    ## Remove some columns
    df = df.drop(columns=['ProductorNIF', 'Marcoplantacionh',
                 'Marcoplantacionv', 'Asesoramiento'])
    ## Change column names
    try:
        df.columns = ["harvestYear", "parcelProvinceId", "parcelMunicipalityId", "parcelPolygonId", "parcelId", "parcelEnclosureId", "parcelGeographicSpot", "parcelAggregatedId", "parcelZoneId", "orderPAC", "subOrderPAC", "areaSIGPAC", "area", "cropId",
                      "parcelVarietyId", "irrigationKind", "tenureRegimeId", "plantationYear", "numberOfTrees", "plantationDensity", "ATRIA_ADV_ASV", "parcelVulnerableArea", "specificZones", "parcelUse", "slope", "UHC", "UHCDescription", "ZepaZone", "SIEZone"]
    except Exception as e:
        raise ValueError("Error changing column names: ", e)
    ## Remove rows with empty parcelUse
    df = df[df["parcelUse"].notna()]
    ## Convert 'N' and 'S' to True and False
    columns = ["specificZones", "parcelVulnerableArea", "ZepaZone", "SIEZone"]
    for column in columns:
        df[column] = df[column].map(lambda x: True if x == "S" else False)
    ## Get data year
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


@task
def load(processed_data, data_year, file_name, file_type):
    logger = get_run_logger()
    print("loading data")
    logger.info("loading data")
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
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
        f"ERP/7eData/{data_year}/{file_name}",
        processed_data_bytes,
        length=processed_data_bytes.getbuffer().nbytes,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata={
            "source": "7eData",
            "type": f"${METADATA_VAL}_${file_type}",
            "year": data_year,
        }
    )


@flow(name="recintos_almendros_refined_etl")
def recintos_almendros_refined_etl():
    objects = extract_objects_to_process()
    for object in objects:
        dfTratamientos = object["treatments"]
        dfParcels = object["parcels"]
        name = object["name"]
        processed_data_treatments, data_year = transform_treatments(dfTratamientos)
        processed_data_parcels, data_year = transform_parcels(dfParcels)
        load(processed_data_parcels, data_year, f"{name}_PARCELAS_{data_year}.xlsx", "parcelas")
        load(processed_data_treatments, data_year,
            f"{name}_TRATAMIENTOS_{data_year}.xlsx", "tratamientos")


if __name__ == "__main__":
    recintos_almendros_refined_etl()
