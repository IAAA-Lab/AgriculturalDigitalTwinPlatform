from utils.functions import DB_MongoClient
import pandas as pd
import os
from .dto.historical_weather_dto import HistoricalWeatherDTO
# Get rid of insecure warning
import requests
import urllib3
from prefect import flow, get_run_logger
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


async def extract_historical_weather_data(meteoStationId: str, dateInit: str, dateEnd: str) -> dict:

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetclimatologiadiaria",
        # Date format: DD-MM-YYYY
        "initdate": dateInit,
        "enddate": dateEnd,
        "idema": meteoStationId
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, headers=headers, json=body, timeout=14)
    if response.status_code != 200:
        raise Exception(
            f"Error getting historic weather data for meteoStationId: {meteoStationId} - request: {response.text}")
    return response.json()


async def transform_historic_weather_data(weather_data: dict):
    weather_data_list = []
    for weather_data_item in weather_data:
        historical_weather_dto = HistoricalWeatherDTO.from_dict(
            weather_data_item)
        weather_data_list.append(
            {
                "date": pd.to_datetime(historical_weather_dto.fecha, format="%Y-%m-%d"),
                "idema": str(historical_weather_dto.indicativo),
                "height": float(historical_weather_dto.altitud),
                "tmed": float(historical_weather_dto.tmed),
                "prec": float(historical_weather_dto.prec),
                "tmin": float(historical_weather_dto.tmin),
                "tminTime": str(historical_weather_dto.horatmin),
                "tmax": float(historical_weather_dto.tmax),
                "tmaxTime": str(historical_weather_dto.horatmax),
                "windDir": float(historical_weather_dto.dir),
                "windSpeed": float(historical_weather_dto.velmedia),
                "windGust": float(historical_weather_dto.racha),
                "windGustTime": str(historical_weather_dto.horaracha),
            }
        )
    return weather_data_list


async def load_weather_data(weather_data_list: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Because update_one is really slow, we use insert_many
    if weather_data_list is not None:
        db.Weather.insert_many(weather_data_list)

@flow
async def historical_weather_dt_etl(meteo_station_id: str, date_init: str, date_end: str):
    logger = get_run_logger()
    # Extract every 3 years
    date_init = pd.to_datetime(date_init, format="%d-%m-%Y")
    date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
    while date_init < date_end:
        date_end_block = date_init + pd.DateOffset(years=3)
        if date_end_block > date_end:
            date_end_block = date_end
        try:
            weather_data_raw = await extract_historical_weather_data(meteo_station_id, date_init.strftime(
                "%d-%m-%Y"), date_end_block.strftime("%d-%m-%Y"))
            weather_data_processed = await transform_historic_weather_data(
                weather_data_raw)
            await load_weather_data(weather_data_processed)
        except Exception as e:
            logger.error(f"Error in meteo_station_id: {meteo_station_id} between {date_init} and {date_end_block} - {e}")
        date_init = date_end_block


if __name__ == "__main__":
    meteo_station_id = "2539"
    date_init = "01-01-2020"
    date_end = "31-12-2020"
    historical_weather_dt_etl(
        meteo_station_id, date_init, date_end)
