import asyncio
import datetime
import io
from etl.recintos_cercanos.recintos_etl import recintos_etl
import pandas as pd
from prefect import flow, task
from utils.functions import DB_MinioClient
from utils.constants import Constants
from prefect.deployments import run_deployment


BUCKET_FROM_NAME = Constants.STORAGE_TRUSTED_ZONE.value
CURRENT_DATE_FORMATTED = datetime.datetime.now().strftime("%d-%m-%Y")


@task(retries=3, retry_delay_seconds=20)
def extract_enclosures_properties(file_name: str):
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, file_name).read()
    stats = minio_client.stat_object(BUCKET_FROM_NAME, file_name)
    df = pd.read_parquet(io.BytesIO(data))
    return {
        "parcels": df,
        "year": stats.metadata["x-amz-meta-year"],
    }


@task
def transform_parcelas(df: pd.DataFrame):
    # Loop through the rows using intertuples()
    enclosuresProperties = []
    for row in df.itertuples():
        enclosureId = f"{row.parcelProvinceId}-{row.parcelMunicipalityId}-{row.parcelAggregatedId}-{row.parcelZoneId}-{row.parcelPolygonId}-{row.parcelId}-{row.parcelEnclosureId}"
        # Get enclosures
        enclosureProperties = {
            "id": enclosureId,
            "geographicSpot": row.parcelGeographicSpot,
            "cropId": str(row.cropId),
            "areaSIGPAC": row.areaSIGPAC,
            "area": row.area,
            "varietyId": str(row.parcelVarietyId),
            "rainfedOrIrrigated": row.irrigationKind,
            "tenureRegimeId": str(row.tenureRegimeId),
            "plantationYear": row.plantationYear,
            "numberOfTrees": row.numberOfTrees,
            "plantationDensity": row.plantationDensity,
            "ATRIA_ADV_ASV": row.ATRIA_ADV_ASV,
            "vulnerableArea": row.parcelVulnerableArea,
            "specificZones": row.specificZones,
            "parcelUse": row.parcelUse,
            "slope": row.slope,
            "UHC": str(row.UHC),
            "UHCDescription": row.UHCDescription,
            "ZEPAZone": row.ZepaZone,
            "SIEZone": row.SIEZone,
            "cropName": row.cropName if row.cropName != "None" else None,
        }

        enclosuresProperties.append(enclosureProperties)

    return enclosuresProperties


# ----------------- Flows -----------------

@flow(name="recintos_almendros_parcels_dt_etl")
async def recintos_almendros_parcels_dt_etl(file_name: str):
    # Extract
    object = extract_enclosures_properties.submit(file_name).result()
    dfParcels = object["parcels"]
    year = int(object["year"])
    enclosuresProperties = transform_parcelas.submit(dfParcels).result()
    # Run in batches of BATCH_SIZE to avoid overloading the server
    BATCH_SIZE = 30
    for i in range(0, len(enclosuresProperties), BATCH_SIZE):
        tasks = []
        for enclosureProperties in enclosuresProperties[i:i+BATCH_SIZE]:
            tasks.append(asyncio.create_task(
                recintos_etl(year, enclosureProperties)))
        await asyncio.gather(*tasks, return_exceptions=True)
        await asyncio.sleep(1)
    # Asynchronously extract the rest of the information
    await run_deployment(
        name="cultivos_identificadores_dt_etl/event-driven")
    await run_deployment(
        name="historical_weather_scheduled_etl/scheduled")
    await run_deployment(
        name="ndvi_scheduled_etl/scheduled")


if __name__ == "__main__":
    asyncio.run(recintos_almendros_parcels_dt_etl(
        file_name="/ERP/7eData/2022/Recintos_Almendros_Cercanos_y_Otros_Cultivos_PARCELS_2022.xlsx.parquet"))
