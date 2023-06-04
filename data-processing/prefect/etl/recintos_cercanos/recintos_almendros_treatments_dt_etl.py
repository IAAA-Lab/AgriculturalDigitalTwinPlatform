import io

import requests

from etl.recintos_cercanos.recintos_user_info_etl import recintos_user_info_etl
from utils.constants import Constants
import pandas as pd
from prefect import flow, task
import asyncio
from datetime import timedelta
from utils.functions import DB_MinioClient, DB_MongoClient

BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value
USER_INFO_FROM_DATE = "01-01-2014"
USER_INFO_TO_DATE = "01-01-2023"


@task(name="extract_recintos_almendros_tratamientos_dt_etl")
def extract(file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()

    data = minio_client.get_object(
        BUCKET_FROM_NAME, file_name).read()
    df = pd.read_parquet(io.BytesIO(data))
    return df


@task(name="transform_recintos_almendros_tratamientos_dt_etl")
def transform(df: pd.DataFrame):
    # Convert to Digital Twin domain
    activities = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"

        activity = {
            "userId": row.secUserId,
            "enclosureId": enclosureId,
            "date": pd.to_datetime(row.harvestInitDate),
            "activity": "TRATAMIENTO FITOSANITARIO",
            "properties": {
                "broth": str(row.broth),
                "doseKind": row.doseKind,
                "doseUnit": row.doseUnit,
                "doseMovement": row.doseMovement,
                "safePeriod": row.safePeriodMovement,
                "quantity": row.phytosanitaryQuantityMovement,
                "healthAgent": {
                    "id": row.secUserId,
                    "name": row.secUserName,
                },
                "plague": {
                    "id": row.plagueTreatmentEffectsId,
                    "name": row.plagueEffects,
                },
                "phytosanitary": {
                    "id": str(row.phytosanitaryId),
                    "name": row.phytosanitaryName,
                    "formula": row.phytosanitaryFormula,
                }
            }
        }

        activities.append(activity)
    return activities


@task(name="load_recintos_almendros_tratamientos_dt_etl")
def load(activities):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    db.Activities.insert_many(activities)


@flow(name="recintos_almendros_treatments_dt_etl")
async def recintos_almendros_treatments_dt_etl(file_name: str):
    df = extract.submit(file_name).result()
    activities = transform.submit(df).result()
    load.submit(activities)
    # ETL for user info, including crops
    date_init = pd.to_datetime(USER_INFO_FROM_DATE, format="%d-%m-%Y")
    date_end = pd.to_datetime(USER_INFO_TO_DATE, format="%d-%m-%Y")

    # List of unique tuples (userId, enclosureId)
    activities = list({(activity["userId"], activity["enclosureId"])
                          for activity in activities})

    # Create a limit to the number of concurrent requests
    BATCH_SIZE = 50
    while date_init < date_end:
        date_end_block = date_init + timedelta(days=365)
        if date_end_block > date_end:
            date_end_block = date_end
        # Activities in batches of BATCH_SIZE
        for i in range(0, len(activities), BATCH_SIZE):
            tasks = []
            try:
                for activity in activities[i:i + BATCH_SIZE]:
                    # Run code in different threads
                    tasks.append(asyncio.create_task(recintos_user_info_etl(
                        activity[0], date_init, [activity[1]])))
                # Wait for all tasks to complete
                await asyncio.gather(*tasks, return_exceptions=True)
                await asyncio.sleep(0.5)
            except Exception as e:
                print(e)
                continue
        date_init = date_end_block


#  ----------- TESTS ------------
if __name__ == "__main__":
    asyncio.run(recintos_almendros_treatments_dt_etl(
        "/ERP/7eData/2022/Recintos_Almendros_Cercanos_y_Otros_Cultivos_TRATAMIENTOS_2022.xlsx.parquet"))
