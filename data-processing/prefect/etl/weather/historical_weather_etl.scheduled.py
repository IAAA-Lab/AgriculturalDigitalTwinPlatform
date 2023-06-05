from __notifications__.email_notifications import notify_exc_by_email
from prefect import flow, task
from etl.weather.historical_weather_etl import historical_weather_dt_etl, test_historical_weather_dt_etl
from utils.functions import DB_MongoClient
from datetime import datetime
import asyncio

HISTORIC_WEATHER_EXTRACT_FIRST_DATE = "01-01-2018"


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
def extract_distinct_meteo_stations_ids():
    mongo_client = DB_MongoClient().connect()
    return mongo_client.Enclosures.distinct("meteoStation.idema")


@task(retries=3, retry_delay_seconds=10, timeout_seconds=15)
def extract_last_known_date(meteo_station_id: str):
    mongo_client = DB_MongoClient().connect()
    # Extract last known date
    last_known_date = mongo_client.Weather.find_one(
        {"idema": meteo_station_id}, sort=[("date", -1)])
    if last_known_date:
        return last_known_date["date"]
    return HISTORIC_WEATHER_EXTRACT_FIRST_DATE


@flow(name="historical_weather_scheduled_etl")
async def historical_weather_scheduled_etl():
    meteo_station_ids = extract_distinct_meteo_stations_ids.submit().result()
    # Get the last week of data
    dateEnd = datetime.now().strftime("%d-%m-%Y")
    # Run in batches of BATCH_SIZE to avoid overloading the server
    BATCH_SIZE = 30
    for i in range(0, len(meteo_station_ids), BATCH_SIZE):
        tasks = []
        for meteo_station_id in meteo_station_ids[i:i+BATCH_SIZE]:
            last_known_date = extract_last_known_date.submit(
                meteo_station_id).result(raise_on_failure=False)
            if isinstance(last_known_date, Exception):
                continue
            tasks.append(asyncio.create_task(historical_weather_dt_etl(
                meteo_station_id, last_known_date, dateEnd)))
        await asyncio.gather(*tasks, return_exceptions=True)
        await asyncio.sleep(1)


# -------------------- TEST -------------------- #
if __name__ == "__main__":
    asyncio.run(historical_weather_scheduled_etl())
