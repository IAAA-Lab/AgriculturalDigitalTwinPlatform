from prefect import flow, task
import pandas as pd
import io
from etl.utils.functions import DB_MinioClient


FILE_NAME = "cultivos_identificadores.xlsx"


@task
def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Get data from MinIO
    data = minio_client.get_object(
        "landing-zone", FILE_NAME).read()
    df = pd.read_excel(io.BytesIO(data), engine="openpyxl",
                       sheet_name="Sheet1", na_values=[''])
    return df


@task
def transform(df: pd.DataFrame):
    # Change column names
    try:
        df.columns = ["agroMeasureId", "plantationKind", "plantationSubKind", "codeType", "cropName", "cropVariety", "cropId", "cropVarietyId", "RainfedIrrigated"]
    except Exception as e:
        # Finish flow with error
        raise ValueError("Error changing column names: ", e)
    # Validate data

    # Modify data
    ## If the column "cropVarietyId" has "***" substitute it with NaN
    df["cropVarietyId"] = df["cropVarietyId"].replace(to_replace="***", value=None)
    ## Substitute *** for "Cualquiera"
    df = df.replace(to_replace="***", value="Cualquiera")
    return df

@task
def load(processed_data, file_name):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    # Save data to MinIO
    with io.BytesIO() as data:
        processed_data.to_excel(data, index=False)
        data.seek(0)
        minio_client.put_object(
        "trusted-zone",
        f"ERP/unknown/{file_name}",
        data,
        length=data.getbuffer().nbytes,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        metadata={
            "source": "unknown",
            "type": "trusted"
        }
    )


@flow(name="cultivos_identificadores_etl")
def cultivos_identificadores_etl():
    df = extract()
    processed_data = transform(df)
    load(processed_data, FILE_NAME)


if __name__ == "__main__":
    cultivos_identificadores_etl()
