from prefect import flow, task
from etl.ndvi.ndvi_etl import ndvi_etl
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
    # Create new list with dates that goes from year to year for each enclosure till date_end
    enclosure_ids_new = []
    for enclosure_id in enclosures_ids:
        enclosure_ids_new.append(
            {"enclosure_id": enclosure_id, "date_init": extract_last_known_date(enclosure_id)})

    await ndvi_etl(enclosure_ids_new, date_end)
# ------------------ TEST ------------------

# Test and debug the flow locally
if __name__ == "__main__":
    asyncio.run(ndvi_scheduled_etl(return_state=True))
