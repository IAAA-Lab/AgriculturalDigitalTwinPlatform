import io
import os
import re

from etl.utils.constants import Constants
import pandera as pa
import pandas as pd
from prefect import flow, get_run_logger, task
from etl.utils.functions import DB_MinioClient

BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value
BUCKET_TO_NAME = Constants.STORAGE_TRUSTED_ZONE.value


@task
def extract(file_name: str) -> dict:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, file_name).read()
    stat = minio_client.stat_object(BUCKET_FROM_NAME, file_name)
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Parcelas", na_values=[''])
    return {
        "parcels": df,
        "name": re.split(r"\.", file_name)[0],
        "metadata": {
            "type": stat.metadata["x-amz-meta-type"]
        }
    }


@task
def clean(df: pd.DataFrame):
    # Remove some columns
    if "ProductorNIF" in df.columns:
        df = df.drop(columns=['ProductorNIF', 'Marcoplantacionh',
                 'Marcoplantacionv', 'Asesoramiento'])
    else:
        df = df.drop(columns=['Marcoplantacionh', 'Marcoplantacionv', 'Asesoramiento'])
    # Change column names
    try:
        df.columns = ["harvestYear", "parcelProvinceId", "parcelMunicipalityId", "parcelPolygonId", "parcelId", "parcelEnclosureId", "parcelGeographicSpot", "parcelAggregatedId", "parcelZoneId", "orderPAC", "subOrderPAC", "areaSIGPAC", "area", "cropId",
                      "parcelVarietyId", "irrigationKind", "tenureRegimeId", "plantationYear", "numberOfTrees", "plantationDensity", "ATRIA_ADV_ASV", "parcelVulnerableArea", "specificZones", "parcelUse", "slope", "UHC", "UHCDescription", "ZepaZone", "SIEZone"]
    except Exception as e:
        raise ValueError("Error changing column names: ", e)
    # Trim spaces and tabs to all object columns
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
    # Convert NULL, NP, NaN, etc. to None
    df = df.replace(
        {pd.NA: None, "NP": None, "NaN": None, "": None, "NULL": None})
    # Remove rows with empty parcelUse
    df = df[df["parcelUse"].notna()]
    # Convert 'N' and 'S' to True and False
    columns = ["specificZones", "parcelVulnerableArea", "ZepaZone", "SIEZone"]
    for column in columns:
        df[column] = df[column].map(lambda x: True if x == "S" else False)
    # Get data year
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


@task
def validate(df: pd.DataFrame) -> pd.DataFrame:
    logger = get_run_logger()
    # Define schema
    schema = pa.DataFrameSchema({
        "ProductorNIF": pa.Column(pa.String, required=False),
        "Cosecha": pa.Column(pa.Int),
        "Provincia Id": pa.Column(pa.String),
        "Municipio Id": pa.Column(pa.String),
        "Poligono": pa.Column(pa.String),
        "Parcela": pa.Column(pa.String),
        "Recinto": pa.Column(pa.String),
        "Paraje": pa.Column(pa.String),
        "Agregado": pa.Column(pa.String),
        "Zona": pa.Column(pa.String),
        "OrdenPAC": pa.Column(pa.String),
        "SubOrdenPac": pa.Column(pa.String),
        "SuperficieSIGPAC": pa.Column(pa.Float),
        "SuperficieCultivo": pa.Column(pa.Float),
        "Cultivo Id": pa.Column(pa.String),
        "ParcelaVariedad Id": pa.Column(pa.String, nullable=True),
        "SistemaDeRiego": pa.Column(pa.String, nullable=True),
        "RegimenTenenciaId": pa.Column(pa.String, nullable=True),
        "AñoPlantacion": pa.Column(pa.Int, nullable=True),
        "Nº Arboles": pa.Column(pa.Int, nullable=True),
        "Marcoplantacionh": pa.Column(pa.String, nullable=True),
        "Densidaddesiembra": pa.Column(pa.String, nullable=True),
        "ATRIA / ADV / ASV": pa.Column(pa.String, nullable=True),
        "ZonaVulnerable": pa.Column(pa.String, nullable=True),
        "ZonaEspecifica": pa.Column(pa.String, nullable=True),
        "UsoParcela": pa.Column(pa.String, nullable=True),
        "Asesoramiento": pa.Column(pa.String, nullable=True),
        "Pendiente %": pa.Column(pa.Float),
        "UHC": pa.Column(pa.String, nullable=True),
        "Descripción UHC": pa.Column(pa.String, nullable=True),
        "Zona Zepa": pa.Column(pa.String),
        "Zona SIE": pa.Column(pa.String),
    }, coerce=True, unique_column_names=True)
    # Validate schema
    try:
        return schema.validate(df)
    except pa.errors.SchemaError as e:
        logger.error("Schema validation error: ", e.failure_cases)
        return None


@task
def transform(df: pd.DataFrame):
    # Convert in case of further analysis
    return df.to_parquet()


@task
def load(processed_data: bytes, data_year: int, file_name: str, metadata: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists(BUCKET_TO_NAME):
        minio_client.make_bucket(BUCKET_TO_NAME)
    # Store processed data with metadata in MinIO
    file = io.BytesIO(processed_data)
    minio_client.put_object(
        BUCKET_TO_NAME,
        f"ERP/7eData/{data_year}/{file_name}.parquet",
        file,
        length=file.getbuffer().nbytes,
        content_type="application/octet-stream",
        metadata={
            "source": "7eData",
            "type": metadata,
            "year": data_year,
            "state": "processed"
        }
    )
    minio_client.remove_object(BUCKET_FROM_NAME, f"invalid/{file_name}.xlsx")


@task
def load_invalid(raw_data: pd.DataFrame, metadata: str, file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists(BUCKET_FROM_NAME):
        minio_client.make_bucket(BUCKET_FROM_NAME)
    # Convert processed data to bytes
    file_bytes = io.BytesIO()
    raw_data.to_excel(file_bytes, index=False)
    file_bytes.seek(0)
    # Store processed data with metadata in MinIO
    minio_client.put_object(
        BUCKET_FROM_NAME,
        f"invalid/{file_name}.xlsx",
        file_bytes,
        length=file_bytes.getbuffer().nbytes,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata={
            "state": "raw_invalid",
            "type": metadata,
        }
    )
    # Delete file from MinIO
    minio_client.remove_object(BUCKET_FROM_NAME, f"{file_name}.xlsx")
    # Finish with error
    raise ValueError("Invalid data")


@flow(name="recintos_almendros_parcels_trusted_etl")
def recintos_almendros_parcels_trusted_etl(file_name):
    # Get data from MinIO
    raw_data = extract(file_name)
    parcels = raw_data["parcels"]
    metadata_type = raw_data["metadata"]["type"]
    name = raw_data["name"]
    # Validate data
    validated_data = validate(parcels)
    if validated_data is None:
        load_invalid(parcels, f"{metadata_type}_parcels", name)
        return
    # Clean data
    clean_data, data_year = clean(validated_data)
    # Transform data
    processed_data = transform(clean_data)
    # Load data
    load(processed_data, data_year,
         f"{name}_PARCELS_{data_year}.xlsx", Constants.TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_PARCELS.value)
