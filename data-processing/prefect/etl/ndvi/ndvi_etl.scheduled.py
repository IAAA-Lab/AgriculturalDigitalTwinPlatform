from __notifications__.email_notifications import notify_exc_by_email
from prefect import flow, task, get_run_logger
from etl.ndvi.ndvi_etl import test_ndvi_etl
from utils.functions import DB_MongoClient
from datetime import datetime
from prefect.deployments import run_deployment
import asyncio
from datetime import timedelta

NDVI_EXTRACT_FIRST_DATE = "01-01-2020"


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
async def extract_enclosures_ids():
    mongo_client = DB_MongoClient().connect()
    # Extract unique enclosure ids
    return mongo_client.Enclosures.distinct("id")


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
async def extract_last_known_date(enclosure_id: str):
    mongo_client = DB_MongoClient().connect()
    # Extract last known date
    last_known_date = mongo_client.NDVI.find_one(
        {"enclosureId": enclosure_id}, sort=[("date", -1)])
    if last_known_date is None:
        return NDVI_EXTRACT_FIRST_DATE
    # return date + 1 day
    return (last_known_date["date"] + timedelta(days=1)).strftime("%d-%m-%Y")


@flow(name="ndvi_scheduled_etl")
async def ndvi_scheduled_etl():
    enclosures_ids = await extract_enclosures_ids()
    # Get the last week of data
    date_end = datetime.now().strftime("%d-%m-%Y")
    for enclosure_id in enclosures_ids:
        try:
            last_known_date = await extract_last_known_date(enclosure_id)
            if last_known_date is None:
                continue
            # Run the deployment in the background
            await run_deployment("ndvi_etl/event-driven", parameters={
                "enclosure_id": enclosure_id, "date_init": last_known_date, "date_end": date_end})
        except Exception as e:
            logger = get_run_logger()
            logger.error(
                f"Error running ndvi_etl for enclosure_id: {enclosure_id} - {e}")
            await notify_exc_by_email(str(e))
            continue

# ------------------ TEST ------------------

# Test and debug the flow locally


async def test_ndvi_scheduled_etl():
    enclosure_ids = await extract_enclosures_ids.fn()
    # Get the last week of data
    date_end = datetime.now().strftime("%d-%m-%Y")
    for enclosure_id in enclosure_ids:
        try:
            last_known_date = await extract_last_known_date.fn(enclosure_id)
            if last_known_date is None:
                continue
            await test_ndvi_etl(enclosure_id, last_known_date, date_end)
        except Exception as e:
            print(str(e))
            continue

if __name__ == "__main__":
    asyncio.run(test_ndvi_scheduled_etl())
