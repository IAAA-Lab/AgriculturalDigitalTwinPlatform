import requests
from prefect.tasks import task_input_hash
from datetime import timedelta
from prefect import task, flow
from utils.functions import DB_MongoClient
import pandas as pd
from prefect import flow, task
import os
from .dto.historical_weather_dto import HistoricalWeatherDTO
# Get rid of insecure warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

@task(tags=["agroslab"], retries=3, retry_delay_seconds=10, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(days=7))
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


@task
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


@task
async def load_weather_data(weather_data_list: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Because update_one is really slow, we use insert_many
    if weather_data_list is not None:
        db.Weather.insert_many(weather_data_list)


async def historical_weather_dt_etl(meteo_station_id: str, date_init: str, date_end: str):
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
            print(e)
        date_init = date_end_block

# -------------- TEST -------------- #


def test_historical_weather_dt_etl(meteo_station_id: str, date_init: str, date_end: str):
    # Extract every 3 years
    date_init = pd.to_datetime(date_init, format="%d-%m-%Y")
    date_end = pd.to_datetime(date_end, format="%d-%m-%Y")
    while date_init < date_end:
        date_end_block = date_init + pd.DateOffset(years=3)
        if date_end_block > date_end:
            date_end_block = date_end
        weather_data_raw = extract_historical_weather_data.fn(
            meteo_station_id, date_init.strftime("%d-%m-%Y"), date_end_block.strftime("%d-%m-%Y"))
        if weather_data_raw is None:
            return None
        weather_data_processed = transform_historic_weather_data.fn(
            weather_data_raw)
        load_weather_data.fn(weather_data_processed)
        date_init = date_end_block


if __name__ == "__main__":
    meteo_station_id = "2539"
    date_init = "01-01-2020"
    date_end = "31-12-2020"
    test_historical_weather_dt_etl(
        meteo_station_id, date_init, date_end)
