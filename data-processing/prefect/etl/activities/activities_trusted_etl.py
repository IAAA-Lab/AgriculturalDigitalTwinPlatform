import io
import re
import pandas as pd
import pandera as pa
from prefect import task, flow
from utils.functions import DB_MinioClient
from utils.constants import Constants
from etl.__validation__.schemas import activities_schema

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
                       sheet_name="Hoja1", na_values=[''])
    return {
        "activities": df,
        "name": re.split(r"\.", file_name)[0],
        "metadata": {
            "type": stat.metadata["x-amz-meta-type"]
        }
    }


@task
def clean(df: pd.DataFrame) -> pd.DataFrame:
    # Rename columns
    df = df.rename(columns={
        "FECHA": "date",
        "TAREA-PRODUCTO-DOSIS": "activity",
        "RECINTO ID": "enclosureId",
    })
    # Drop rows with undefined activity, date or parcel
    df = df.dropna(subset=["activity", "date", "enclosureId"])
    # Drop duplicates
    df = df.drop_duplicates()
    # Select columns
    df = df[["date", "activity", "enclosureId"]]
    # Convert date to datetime
    df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")
    return df


@task
def validate(df: pd.DataFrame) -> pd.DataFrame:
    return activities_schema.validate(df)


@task
def transform(df: pd.DataFrame) -> pd.DataFrame:
    # Convert to parquet
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
        f"ERP/PYSTACIL/{data_year}/{file_name}.parquet",
        file,
        length=file.getbuffer().nbytes,
        content_type="application/octet-stream",
        metadata={
            "source": "PYSTACIL",
            "type": metadata,
            "year": data_year,
            "state": "processed"
        }
    )
    minio_client.remove_object(BUCKET_FROM_NAME, f"invalid/{file_name}.xlsx")


@flow(name="activities_trusted_etl")
def activities_trusted_etl(file_name: str):
    # Define flow parameters
    data_year = 2022
    # Define flow
    extracted_data = extract(file_name)
    validated_data = validate(extracted_data["activities"])
    cleaned_data = clean(validated_data)
    transformed_data = transform(cleaned_data)
    load(transformed_data, data_year,
         extracted_data["name"], Constants.METADATA_ACTIVITIES.value)
