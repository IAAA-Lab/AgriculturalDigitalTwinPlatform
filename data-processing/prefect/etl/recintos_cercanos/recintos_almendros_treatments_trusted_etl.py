import io
import re
import pandera as pa
import pandas as pd
from prefect import flow, get_run_logger, task
from utils.functions import DB_MinioClient
from utils.constants import Constants
from etl.__validation__.schemas import recintos_almendros_tratamientos_schema

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
        "name": re.split(r"\.", file_name)[0]
    }


@task
def validate(df: pd.DataFrame):
    return recintos_almendros_tratamientos_schema.validate(df)


@task
def clean(df: pd.DataFrame):
    # Change column names
    df.rename(columns={"MovimientoCosecha": "harvestYear", "MovimientoFechaDeInicio": "harvestInitDate", "Producto": "phytosanitaryId", "ProductoNombre": "phytosanitaryName", "Formulado": "phytosanitaryFormula", "TratamientosPlagaEfectosEnPlagasId": "plagueTreatmentEffectsId", "EfectosEnPlagas": "plagueEffects", "TratamientosPlagaMalasHierbasId": "plagueTreatmentWeedsId", "SecUserNombre": "secUserName", "SecUserNIF": "secUserNIF", "SecUserId": "secUserId", "ParcelaProvinciaId": "parcelProvinceId", "ParcelaMunicipioId": "parcelMunicipalityId", "ParcelaPoligono": "parcelPolygonId", "Parcela": "parcelId", "ParcelaRecinto": "parcelEnclosureId",
              "ParcelaParaje": "parcelGeographicSpot", "ParcelaAgregado": "parcelAggregatedId", "ParcelaZona": "parcelZoneId", "ParcelaCosechaCodigoPAC": "cropId", "ParcelaCosechaCultivoPAC": "crop", "Caldo": "broth", "TipoDeDosisId": "doseKind", "TipoDeDosisDetalle": "doseUnit", "MovimientoParcelaSuperficieTratada": "treatedArea", "Cantidad": "phytosanitaryQuantityMovement", "MovimientoPlazoDeSeguridad": "safePeriodMovement", "MovimientoDosis": "doseMovement", "ParcelaSuperficieCultivo": "parcelArea", "ParcelaSuperficieSIGPAC": "parcelAreaSIGPAC", "ParcelaZonaVulnerable": "parcelVulnerableArea", "UsoDeParcelasId": "parcelSIGPACCode"}, inplace=True)
    # Trim spaces and tabs to all object columns
    df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
    # Convert NULL, NP, NaN, etc. to None
    df = df.replace(
        {pd.NA: None, "NP": None, "NaN": None, "": None, "NULL": None})
    # Remove rows with empty parcelProvinceId, parcelMunicipalityId, parcelPolygonId, parcelId, parcelEnclosureId, parcelZoneId
    rows_to_drop = ["parcelProvinceId", "parcelMunicipalityId",
                    "parcelPolygonId", "parcelId", "parcelEnclosureId", "parcelZoneId", "parcelAggregatedId"]
    for row in rows_to_drop:
        df = df[df[row].notna()]
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


@flow(name="recintos_almendros_treatments_trusted_etl")
def recintos_almendros_treatments_trusted_etl(file_name):
    # Get data from MinIO
    raw_data = extract(file_name)
    treatments = raw_data["treatments"]
    name = raw_data["name"]
    # Validate data
    data = validate(treatments)
    # Clean data
    clean_data, data_year = clean(data)
    # Transform data
    processed_data = transform(clean_data)
    # Load data
    load(processed_data, data_year,
         f"{name}_TRATAMIENTOS_{data_year}", Constants.METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value)

# ---------- TEST ----------
def test_recintos_almendros_treatments_trusted_etl(file_name):
    # Get data from MinIO
    raw_data = extract.fn(file_name)
    treatments = raw_data["treatments"]
    name = raw_data["name"]
    # Validate data
    data = validate.fn(treatments)
    # Clean data
    clean_data, data_year = clean.fn(data)
    print(clean_data)
    # Transform data
    processed_data = transform.fn(clean_data)
    # Load data
    load.fn(processed_data, data_year,
         f"{name}_TRATAMIENTOS_{data_year}", Constants.METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value)


if __name__ == "__main__":
    test_recintos_almendros_treatments_trusted_etl("Recintos_Almendros_Cercanos_y_Otros_Cultivos.xlsx")