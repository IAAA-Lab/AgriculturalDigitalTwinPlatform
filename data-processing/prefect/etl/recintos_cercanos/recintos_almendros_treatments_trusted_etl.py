import io
import re
import pandera as pa
import pandas as pd
from prefect import flow, get_run_logger, task
from utils.functions import DB_MinioClient
from utils.constants import Constants

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
                       sheet_name="Tratamientos", na_values=[''])
    return {
        "treatments": df,
        "name": re.split(r"\.", file_name)[0],
        "metadata": {
            "type": stat.metadata["x-amz-meta-type"]
        }
    }


@task
def validate(df: pd.DataFrame) -> pd.DataFrame:
    # Define schema
    schema = pa.DataFrameSchema({
        "MovimientoCosecha": pa.Column(pa.Int),
        "MovimientoFechaDeInicio": pa.Column(pa.DateTime),
        "Producto": pa.Column(pa.String, nullable=True),
        "ProductoNombre": pa.Column(pa.String),
        "Formulado": pa.Column(pa.String, nullable=True),
        "TratamientosPlagaEfectosEnPlagasId": pa.Column(pa.String, nullable=True),
        "EfectosEnPlagas": pa.Column(pa.String),
        "TratamientosPlagaMalasHierbasId": pa.Column(pa.String, nullable=True),
        "SecUserNombre": pa.Column(pa.String),
        "SecUserNIF": pa.Column(pa.String, nullable=True),
        "SecUserId": pa.Column(pa.String),
        "ParcelaProvinciaId": pa.Column(pa.String),
        "ParcelaMunicipioId": pa.Column(pa.String),
        "ParcelaPoligono": pa.Column(pa.String),
        "Parcela": pa.Column(pa.String),
        "ParcelaRecinto": pa.Column(pa.String),
        "ParcelaParaje": pa.Column(pa.String, nullable=True),
        "ParcelaAgregado": pa.Column(pa.String),
        "ParcelaZona": pa.Column(pa.String),
        "ParcelaCosechaCodigoPAC": pa.Column(pa.String),
        "ParcelaCosechaCultivoPAC": pa.Column(pa.String),
        "Caldo": pa.Column(pa.String, nullable=True),
        "TipoDeDosisId": pa.Column(pa.String, nullable=True),
        "TipoDeDosisDetalle": pa.Column(pa.String),
        "MovimientoParcelaSuperficieTratada": pa.Column(pa.Float32),
        "Cantidad": pa.Column(pa.Float32),
        "MovimientoPlazoDeSeguridad": pa.Column(pa.String, nullable=True),
        "MovimientoDosis": pa.Column(pa.Float32),
        "ParcelaSuperficieCultivo": pa.Column(pa.Float32),
        "ParcelaSuperficieSIGPAC": pa.Column(pa.Float32, nullable=True),
        "ParcelaZonaVulnerable": pa.Column(pa.String, nullable=True),
        "UsoDeParcelasId": pa.Column(pa.String, nullable=True),
    }, coerce=True, unique_column_names=True)
    # Validate schema
    try:
        return schema.validate(df)
    except pa.errors.SchemaError as e:
        logger = get_run_logger()
        logger.error("Schema validation error: ", e.failure_cases)
        return None


@task
def clean(df: pd.DataFrame):
    # Change column names
    df.rename(columns={"MovimientoCosecha": "harvestYear", "MovimientoFechaDeInicio": "harvestInitDate", "Producto": "phytosanitaryId", "ProductoNombre": "phytosanitaryName", "Formulado": "phytosanitaryFormula", "TratamientosPlagaEfectosEnPlagasId": "plagueTreatmentEffectsId", "EfectosEnPlagas": "plagueEffects", "TratamientosPlagaMalasHierbasId": "plagueTreatmentWeedsId", "SecUserNombre": "secUserName", "SecUserNIF": "secUserNIF", "SecUserId": "secUserId", "ParcelaProvinciaId": "parcelProvinceId", "ParcelaMunicipioId": "parcelMunicipalityId", "ParcelaPoligono": "parcelPolygonId", "Parcela": "parcelId", "ParcelaRecinto": "parcelEnclosureId",
              "ParcelaParaje": "parcelGeographicSpot", "ParcelaAgregado": "parcelAggregatedId", "ParcelaZona": "parcelZoneId", "ParcelaCosechaCodigoPAC": "parcelHarvestPACCode", "ParcelaCosechaCultivoPAC": "parcelHavestPACCropTree", "Caldo": "broth", "TipoDeDosisId": "doseKind", "TipoDeDosisDetalle": "doseUnit", "MovimientoParcelaSuperficieTratada": "treatedArea", "Cantidad": "phytosanitaryQuantityMovement", "MovimientoPlazoDeSeguridad": "safePeriodMovement", "MovimientoDosis": "doseMovement", "ParcelaSuperficieCultivo": "parcelArea", "ParcelaSuperficieSIGPAC": "parcelAreaSIGPAC", "ParcelaZonaVulnerable": "parcelVulnerableArea", "UsoDeParcelasId": "parcelSIGPACCode"}, inplace=True)
    # Trim spaces and tabs to all object columns
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
    # Convert NULL, NP, NaN, etc. to None
    df = df.replace(
        {pd.NA: None, "NP": None, "NaN": None, "": None, "NULL": None})
    # Hide sensitive data
    df = df.drop(columns=["secUserNIF"])
    # NOTE: Thanks to Jupyter Notebook, I found out that some number columns are being read as objects
    # Convert strings to uppercase
    df["secUserName"] = df["secUserName"].str.upper()
    # Get data year
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


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
    raise ValueError("Invalid data")


@flow(name="recintos_almendros_treatments_trusted_etl")
def recintos_almendros_treatments_trusted_etl(file_name):
    # Get data from MinIO
    raw_data = extract(file_name)
    treatments = raw_data["treatments"]
    metadata_type = raw_data["metadata"]["type"]
    name = raw_data["name"]
    # Validate data
    validated_data = validate(treatments)
    if validated_data is None:
        load_invalid(treatments, f"{metadata_type}_treatments", name)
        return
    # Clean data
    clean_data, data_year = clean(validated_data)
    # Transform data
    processed_data = transform(clean_data)
    # Load data
    load(processed_data, data_year,
         f"{name}_TRATAMIENTOS_{data_year}.xlsx", Constants.TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value)
