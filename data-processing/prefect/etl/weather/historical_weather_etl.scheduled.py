from __notifications__.email_notifications import notify_exc_by_email
from prefect import flow, task, get_run_logger
from etl.weather.historical_weather_etl import test_historical_weather_dt_etl
from utils.functions import DB_MongoClient
from datetime import datetime
from prefect.deployments import run_deployment
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
        {"meteoStationId": meteo_station_id}, sort=[("date", -1)])
    if last_known_date:
        return last_known_date["date"]
    return HISTORIC_WEATHER_EXTRACT_FIRST_DATE


@flow(name="historical_weather_scheduled_etl")
def historical_weather_scheduled_etl():
    meteo_station_ids = extract_distinct_meteo_stations_ids.submit().result(raise_on_failure=False)
    # Get the last week of data
    dateEnd = datetime.now().strftime("%d-%m-%Y")
    for meteo_station_id in meteo_station_ids:
        last_known_date = extract_last_known_date.submit(meteo_station_id).result(raise_on_failure=False)
        if isinstance(last_known_date, Exception):
            continue
        run_deployment("historical_weather_dt_etl/event-driven", parameters={
            "meteo_station_id": meteo_station_id, "date_init": last_known_date, "date_end": dateEnd})

# -------------------- TEST -------------------- #


def test_historical_weather_scheduled_etl():
    meteo_station_ids = extract_distinct_meteo_stations_ids.fn()
    # Get the last week of data
    dateEnd = datetime.now().strftime("%d-%m-%Y")
    for meteo_station_id in meteo_station_ids:
        try:
            last_known_date = extract_last_known_date.fn(meteo_station_id)
            test_historical_weather_dt_etl(meteo_station_id, last_known_date, dateEnd)
        except Exception as e:
            print(str(e))
            continue

if __name__ == "__main__":
    test_historical_weather_scheduled_etl()
