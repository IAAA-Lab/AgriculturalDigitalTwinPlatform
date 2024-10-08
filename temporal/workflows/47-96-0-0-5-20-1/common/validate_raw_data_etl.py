from ast import Tuple
from utils.functions import DB_MinioClient
from utils.constants import Constants
from etl.__validation__.schemas import activities_schema, recintos_almendros_parcelas_schema, recintos_almendros_tratamientos_schema
import io
import pandas as pd
import pandera as pa
from typing import Union, Tuple
from prefect import flow, get_run_logger

BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value
BUCKET_TO_NAME = Constants.STORAGE_LANDING_ZONE.value


async def extract(file_name: str) -> dict:
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Fetch objects and get metadata
    stat = minio_client.stat_object(BUCKET_FROM_NAME, file_name)
    data = minio_client.get_object(BUCKET_FROM_NAME, file_name).read()
    # Depending on the content type, convert from minio object to pandas dataframe
    return {
        "name": file_name,
        "file_type": stat.content_type,
        "data": await get_dataframe_by_content_type(io.BytesIO(data), stat.content_type),
        "raw_data": data,
    }


async def validate(df: Union[pd.DataFrame, dict[str, pd.DataFrame]]) -> str:
    logger = get_run_logger()
    # Experiment all the schemas
    df_validated = None
    metadata = None

    if isinstance(df, dict):
        for sheet_name, sheet_df in df.items():
            df_validated, metadata = await check_schema_by_name(sheet_df)
            if df_validated is None:
                break
    else:
        df_validated, metadata = await check_schema_by_name(df)
    if df_validated is None:
        logger.error("Invalid schema")
        return Exception("Invalid schema")
    return metadata


async def load(raw_data, content_type: str, file_name: str, metadata: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists(BUCKET_FROM_NAME):
        minio_client.make_bucket(BUCKET_FROM_NAME)
    file_bytes = io.BytesIO(raw_data)
    # Store processed data with metadata in MinIO
    minio_client.put_object(
        BUCKET_FROM_NAME,
        f"{file_name}",
        file_bytes,
        length=file_bytes.getbuffer().nbytes,
        content_type=content_type,
        metadata={
            "state": "raw",
            "type": metadata,
        }
    )


async def load_invalid(raw_data, content_type: str, file_name: str):
    logger = get_run_logger()
    logger.error("Invalid data - loading to invalid zone...")
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Create bucket if it doesn't exist
    if not minio_client.bucket_exists(BUCKET_FROM_NAME):
        minio_client.make_bucket(BUCKET_FROM_NAME)
    file_bytes = io.BytesIO(raw_data)
    # Store processed data with metadata in MinIO
    minio_client.put_object(
        BUCKET_FROM_NAME,
        f"invalid/{file_name}",
        file_bytes,
        length=file_bytes.getbuffer().nbytes,
        content_type=content_type,
        metadata={
            "state": "raw_invalid",
            "type": "invalid",
        }
    )
    # Delete file from MinIO
    minio_client.remove_object(BUCKET_FROM_NAME, f"{file_name}.xlsx")


@flow
async def validate_raw_data_etl(file_name: str):
    # Extract
    raw_data = await extract(file_name)
    file_name = raw_data["name"]
    file_type = raw_data["file_type"]
    data = raw_data["data"]
    raw_data = raw_data["raw_data"]
    # Validate
    metadata = await validate(data)
    if isinstance(metadata, Exception):
        await load_invalid(raw_data, file_type, file_name)
        return
    # Load
    await load(raw_data, file_type, file_name, metadata)

# -------- Helper functions --------


async def check_schema(df: pd.DataFrame, schema: pa.DataFrameSchema) -> pd.DataFrame:
    try:
        return schema.validate(df)
    except Exception:
        return None


async def check_schema_by_name(df: pd.DataFrame) -> Tuple[pd.DataFrame, str]:
    df_validated = await check_schema(df, activities_schema)
    if df_validated is not None:
        metadata = Constants.METADATA_ACTIVITIES.value
        return df_validated, metadata
    df_validated = await check_schema(df, recintos_almendros_parcelas_schema)
    if df_validated is not None:
        metadata = Constants.METADATA_PARCELS_AND_TREATMENTS.value
        return df_validated, metadata
    df_validated = await check_schema(df, recintos_almendros_tratamientos_schema)
    if df_validated is not None:
        metadata = Constants.METADATA_PARCELS_AND_TREATMENTS.value
        return df_validated, metadata

    return None, None


# async def get_bytes_by_content_type(df: pd.DataFrame, content_type: str) -> bytes:
#     match content_type:
#         case "application/vnd.ms-excel":
#             return df.to_excel()
#         case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
#             return df.to_excel()
#         case "text/csv":
#             return df.to_csv()
#         case "application/json":
#             return df.to_json()
#         case _:
#             raise ValueError("Invalid content type")


async def get_dataframe_by_content_type(file_bytes: bytes, content_type: str) -> Union[pd.DataFrame, dict[str, pd.DataFrame]]:
    match content_type:
        case "application/vnd.ms-excel":
            return pd.read_excel(file_bytes, sheet_name=None, engine="openpyxl", na_values=[''])
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            return pd.read_excel(file_bytes, sheet_name=None, engine="openpyxl", na_values=[''])
        case "text/csv":
            return pd.read_csv(file_bytes)
        case "application/json":
            return pd.read_json(file_bytes)
        case _:
            raise ValueError("Invalid content type")
