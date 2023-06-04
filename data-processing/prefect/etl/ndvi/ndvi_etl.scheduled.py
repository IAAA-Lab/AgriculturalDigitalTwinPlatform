import requests
from __notifications__.email_notifications import notify_exc_by_email
from prefect import flow, task
from etl.ndvi.ndvi_etl import test_ndvi_etl, ndvi_etl
from utils.functions import DB_MongoClient
from datetime import datetime
import asyncio
from datetime import timedelta

NDVI_EXTRACT_FIRST_DATE = "01-01-2020"


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
def extract_enclosures_ids():
    mongo_client = DB_MongoClient().connect()
    # Extract unique enclosure ids
    result = mongo_client.Enclosures.distinct("id")
    if result is None:
        raise Exception("No enclosures found")
    return result


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
def extract_last_known_date(enclosure_id: str):
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
    enclosures_ids = extract_enclosures_ids()
    # Get the last week of data
    date_end = datetime.now().strftime("%d-%m-%Y")
    # Run in batches of BATCH_SIZE to avoid overloading the server
    BATCH_SIZE = 30
    for i in range(0, len(enclosures_ids), BATCH_SIZE):
        ndvi_flows = []
        for enclosure_id in enclosures_ids[i:i+BATCH_SIZE]:
            last_known_date = extract_last_known_date.submit(
                enclosure_id).result(raise_on_failure=False)
            ndvi_flows.append(asyncio.create_task(
                ndvi_etl(enclosure_id, last_known_date, date_end)))
        await asyncio.gather(*ndvi_flows, return_exceptions=True)
# ------------------ TEST ------------------

# Test and debug the flow locally
if __name__ == "__main__":
    asyncio.run(ndvi_scheduled_etl(return_state=True))
