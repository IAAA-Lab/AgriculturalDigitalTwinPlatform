import pandas as pd
from prefect import flow, task, get_run_logger
from pymongo import MongoClient
import requests
import os


@task
def extract(meteoStationId: str, startDate: str, endDate: str) -> dict:
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    startDate = pd.to_datetime(startDate).strftime("%d-%m-%Y")
    endDate = pd.to_datetime(endDate).strftime("%d-%m-%Y")

    body = {
        "operation": "aemetclimatologiadiaria",
        "initdate": startDate,
        "enddate": endDate,
        "idema": meteoStationId
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }
    try:
        response = requests.post(
            AGROSLAB_API_URL, json=body, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(
            f"Error getting weather data from Agroslab API: {response.status_code} - {response.text}")
    except Exception as e:
        raise Exception(
            f"Error getting weather data from Agroslab API: {e}")


@task
def transform(weather_data: dict):
    if weather_data is None:
        return None

    weather_data_list = []
    for weather_data_item in weather_data:
        # Convert date 2021-01-01 to 2021-02-01T00:00:00.000Z
        try:
            weather_data_list.append(
                {
                    "date": pd.to_datetime(weather_data_item["fecha"]).strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                    "idema": weather_data_item["indicativo"],
                    "height": float(weather_data_item["altitud"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "tmed": float(weather_data_item["tmed"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    # If prec is not a number, set it to 0
                    "prec": float(weather_data_item["prec"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "tmin": float(weather_data_item["tmin"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "tminTime": weather_data_item["horatmin"],
                    "tmax": float(weather_data_item["tmax"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "horaTmax": weather_data_item["horatmax"],
                    "windDir": float(weather_data_item["dir"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "windSpeed": float(weather_data_item["velmedia"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "windGust": float(weather_data_item["racha"].replace(",", ".")) if weather_data_item["prec"].replace(",", "").isnumeric() else 0,
                    "windGustTime": weather_data_item["horaracha"],
                }
            )
        except Exception as e:
            raise Exception(
                f"Error transforming weather data: {weather_data_item} - {e}")
    return weather_data_list


@task
async def load(weather_list: dict):
    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    db = mongo_client[MONGODB_DB]

    for weather in weather_list:
        db.WeatherData.update_one(
            {"idema": weather["idema"], "date": weather["date"]}, {"$set": weather}, upsert=True)


@flow(name="historical_weather")
def historical_weather(idema: str, startDate: str, endDate: str) -> dict:
    try:
        data = extract(idema, startDate, endDate)
        logger = get_run_logger()
        logger.info(data)
        processed_data = transform(data)
        load.submit(processed_data)
        return processed_data
    except Exception as e:
        logger = get_run_logger()
        logger.info(str(e))
        return {
            "errorMessage": "Error obteniendo datos históricos de la estación metereológica",
            "payload": None
        }


if __name__ == "__main__":
    historical_weather()
