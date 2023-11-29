from prefect import get_run_logger, flow
from etl.weather.historical_weather_etl import historical_weather_dt_etl
from utils.functions import DB_MongoClient
from datetime import datetime
import asyncio

HISTORIC_WEATHER_EXTRACT_FIRST_DATE = "01-01-2018"


async def extract_distinct_meteo_stations_ids():
    mongo_client = DB_MongoClient().connect()
    return mongo_client.Enclosures.distinct("meteoStation.idema")


async def extract_last_known_date(meteo_station_id: str):
    mongo_client = DB_MongoClient().connect()
    # Extract last known date
    last_known_date = mongo_client.Weather.find_one(
        {"idema": meteo_station_id}, sort=[("date", -1)])
    if last_known_date:
        return last_known_date["date"]
    return HISTORIC_WEATHER_EXTRACT_FIRST_DATE

@flow(log_prints=True)
async def historical_weather_scheduled_etl():
    logger = get_run_logger()
    meteo_station_ids = await extract_distinct_meteo_stations_ids()
    # Get the last week of data
    dateEnd = datetime.now().strftime("%d-%m-%Y")
    # Run in batches of BATCH_SIZE to avoid overloading the server
    BATCH_SIZE = 30
    for i in range(0, len(meteo_station_ids), BATCH_SIZE):
        tasks = []
        for meteo_station_id in meteo_station_ids[i:i+BATCH_SIZE]:
            try:
                last_known_date = await extract_last_known_date(meteo_station_id)
                tasks.append(historical_weather_dt_etl(meteo_station_id, last_known_date.strftime("%d-%m-%Y"), dateEnd))
            except Exception as e:
                logger.error(f"Error in meteo_station_id: {meteo_station_id} - {e}")
        res = await asyncio.gather(*tasks, return_exceptions=True)
        for r in res:
            if isinstance(r, Exception):
                logger.error(f"Error in meteo_station_id: {meteo_station_id} between {last_known_date} and {dateEnd} - {res}")
        await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(historical_weather_scheduled_etl())
