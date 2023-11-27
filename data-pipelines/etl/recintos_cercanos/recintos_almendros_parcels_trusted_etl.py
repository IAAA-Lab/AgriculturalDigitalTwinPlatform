import io
import re
from prefect import flow
from utils.constants import Constants
import pandas as pd
from utils.functions import DB_MinioClient
from etl.__validation__.schemas import recintos_almendros_parcelas_schema

BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value
BUCKET_TO_NAME = Constants.STORAGE_TRUSTED_ZONE.value


async def extract(file_name: str) -> dict:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and filter by metadata
    data = minio_client.get_object(BUCKET_FROM_NAME, file_name).read()
    stat = minio_client.stat_object(BUCKET_FROM_NAME, file_name)
    try:
        df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                           sheet_name="Parcelas", na_values=[''])
    except Exception as e:
        print(e)
    return {
        "parcels": df,
        "name": re.split(r"\.", file_name)[0],
    }


async def validate(df: pd.DataFrame) -> pd.DataFrame:
    return recintos_almendros_parcelas_schema.validate(df)


async def clean(df: pd.DataFrame):
    # Remove some columns
    if "ProductorNIF" in df.columns:
        df = df.drop(columns=['ProductorNIF', 'Marcoplantacionh',
                              'Marcoplantacionv', 'Asesoramiento'])
    else:
        df = df.drop(columns=['Marcoplantacionh',
                     'Marcoplantacionv', 'Asesoramiento'])
    # Change column names
    df.rename(columns={"Cosecha": "harvestYear", "Provincia Id": "parcelProvinceId", "Municipio Id": "parcelMunicipalityId", "Poligono": "parcelPolygonId", "Parcela": "parcelId", "Recinto": "parcelEnclosureId", "Paraje": "parcelGeographicSpot", "Agregado": "parcelAggregatedId", "Zona": "parcelZoneId", "OrdenPAC": "orderPAC", "SubOrdenPac": "subOrderPAC", "SuperficieSIGPAC": "areaSIGPAC", "SuperficieCultivo": "area", "Cultivo Id": "cropId", "ParcelaVariedad Id": "parcelVarietyId",
              "SistemaDeRiego": "irrigationKind", "RegimenTenenciaId": "tenureRegimeId", "AñoPlantacion": "plantationYear", "Nº Arboles": "numberOfTrees", "Densidaddesiembra": "plantationDensity", "ATRIA / ADV / ASV": "ATRIA_ADV_ASV", "ZonaVulnerable": "parcelVulnerableArea", "ZonaEspecifica": "specificZones", "UsoParcela": "parcelUse", "Pendiente %": "slope", "UHC": "UHC", "Descripción UHC": "UHCDescription", "Zona Zepa": "ZepaZone", "Zona SIE": "SIEZone"}, inplace=True)
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
    # Convert 'N' and 'S' to True and False
    columns = ["specificZones", "parcelVulnerableArea", "ZepaZone", "SIEZone"]
    for column in columns:
        df[column] = df[column].map(lambda x: True if x == "S" else False)
    # Get data year
    data_year = df['harvestYear'].iloc[:1].values[0]
    return df, data_year


async def transform(df: pd.DataFrame):
    # Convert in case of further analysis
    return df.to_parquet()


async def load(processed_data: bytes, data_year: int, file_name: str, metadata: str):
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


@flow
async def recintos_almendros_parcels_trusted_etl(file_name):
    # Get data from MinIO
    raw_data = await extract(file_name)
    parcels = raw_data["parcels"]
    name = raw_data["name"]
    # Validate data
    data = await validate(parcels)
    # Clean data
    clean_data, data_year = await clean(data)
    # Transform data
    processed_data = await transform(clean_data)
    # Load data
    await load(processed_data, data_year,
               f"{name}_PARCELS_{data_year}", Constants.METADATA_PARCELS_AND_TREATMENTS_PARCELS.value)

# ---------- TEST ---------- #


if __name__ == "__main__":
    # Execute only if run as a script
    recintos_almendros_parcels_trusted_etl(
        "Recintos_Almendros_Cercanos_y_Otros_Cultivos_2.xlsx")
