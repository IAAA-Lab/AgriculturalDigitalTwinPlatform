import io

from etl.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
from etl.recintos_cercanos.recintos_etl import recintos_etl

from etl.recintos_cercanos.recintos_user_info_etl import recintos_user_info_etl
from utils.constants import Constants
import pandas as pd
import asyncio
from datetime import timedelta
from utils.functions import DB_MinioClient, DB_MongoClient


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value
USER_INFO_FROM_DATE = "01-01-2017"
USER_INFO_TO_DATE = "01-01-2023"


def extract(file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()

    data = minio_client.get_object(
        BUCKET_FROM_NAME, file_name).read()
    df = pd.read_parquet(io.BytesIO(data))
    return df


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
            "cropId": row.cropId,
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


def activities_by_user_id(data: list):
    # Group activities by userId and mantain only enclosureId, date and activity columns
    activities_by_user_id = {}
    for activity in data:
        if activity["userId"] not in activities_by_user_id:
            activities_by_user_id[activity["userId"]] = []
        activities_by_user_id[activity["userId"]].append(
            {"enclosureId": activity["enclosureId"], "date": activity["date"], "cropId": activity["cropId"]})
    return activities_by_user_id


def load(activities):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    db.Activities.insert_many(activities)


def load_crop_info(activities_list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    for userId, activities in activities_list.items():
        for activity in activities:
            db.Enclosures.update_one(
                {"id": activity["enclosureId"]}, {"$set": {"properties.cropId": activity["cropId"]}})


def recintos_almendros_treatments_dt_etl(file_name: str):
    df = extract(file_name)
    activities = transform(df)
    load(activities)
    # ETL for user info, including crops
    date_init = pd.to_datetime(USER_INFO_FROM_DATE, format="%d-%m-%Y")
    date_end = pd.to_datetime(USER_INFO_TO_DATE, format="%d-%m-%Y")

    # List of unique tuples (userId, enclosureId)
    activities = activities_by_user_id(activities)

    while date_init < date_end:
        date_end_block = date_init + timedelta(days=365)
        if date_end_block > date_end:
            date_end_block = date_end
        for userId, activity in activities.items():
            # Get all enclosureIds in the activities block
            enclosureIds = [activity["enclosureId"] for activity in activity]
            recintos_user_info_etl(
                userId, date_init, enclosureIds)
            if date_init.year == 2022:
                recintos_etl(date_init.year, enclosureIds)
        date_init = date_end_block

    load_crop_info(activities)
    # Asynchronously extract the rest of the information
    cultivos_identificadores_dt_etl()


#  ----------- TESTS ------------
if __name__ == "__main__":
    asyncio.run(recintos_almendros_treatments_dt_etl(
        "/ERP/7eData/2022/Recintos_Almendros_Cercanos_y_Otros_Cultivos_TRATAMIENTOS_2022.parquet"))
