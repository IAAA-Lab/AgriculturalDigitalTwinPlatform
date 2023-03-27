from prefect import flow, task, get_run_logger
from .dto.daily_weather_dto import DailyWeather
import requests
import os


@task
def extract(parcelId: str):
    logger = get_run_logger()
    print("extracting data")
    logger.info("extracting data")

    # Extract data from Rest API

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    municipality = parcelId.split("-")[1]
    if len(municipality) == 1:
        municipality = "00" + municipality
    elif len(municipality) == 2:
        municipality = "0" + municipality

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": parcelId.split("-")[0],
        "municipio": municipality,
        "type": "horaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, json=body, headers=headers)

    return response.json()


@task
def transform(data, parcelId) -> dict:
    logger = get_run_logger()
    print("transforming data")
    logger.info("transforming data")
    print(data)
    response = DailyWeather.from_dict(data[0])
    daily_weather = {
        "type": "daily_weather",
        "parcelId": parcelId,
        "origin": {
            "producer": response.origen.productor,
            "web": response.origen.web,
            "language": response.origen.language,
            "copyright": response.origen.copyright,
            "legalNote": response.origen.notaLegal,
        },
        "elaboratedAt": response.elaborado,
        "province": response.provincia,
        "municipality": response.nombre,
        "prediction": [{
            "skyState": map(lambda skyState: {
                "value": skyState.value,
                "period": skyState.periodo,
                "description": skyState.descripcion,
            }, response.prediccion.dia[0].estadoCielo),
            "prec": map(lambda prec: {
                "value": prec.value,
                "period": prec.periodo,
            }, response.prediccion.dia[0].precipitacion),
            "probPrec": map(lambda probPrec: {
                "value": probPrec.value,
                "period": probPrec.periodo,
            }, response.prediccion.dia[0].probPrecipitacion),
            "probStorm": map(lambda probStorm: {
                "value": probStorm.value,
                "period": probStorm.periodo,
            }, response.prediccion.dia[0].probTormenta),
            "snow": map(lambda snow: {
                "value": snow.value,
                "period": snow.periodo,
            }, response.prediccion.dia[0].nieve),
            "probSnow": map(lambda probSnow: {
                "value": probSnow.value,
                "period": probSnow.periodo,
            }, response.prediccion.dia[0].probNieve),
            "ta": map(lambda ta: {
                "value": ta.value,
                "period": ta.periodo,
            }, response.prediccion.dia[0].temperatura),
            "hr": map(lambda hr: {
                "value": hr.value,
                "period": hr.periodo,
            }, response.prediccion.dia[0].humedadRelativa),
            "wind": map(lambda wind: {
                "direction": wind.direccion,
                "period": wind.periodo,
                "speed": wind.velocidad,
                "value": wind.value,
            }, response.prediccion.dia[0].vientoAndRachaMax),
            "date": response.prediccion.dia[0].fecha,
            "dawn": response.prediccion.dia[0].orto,
            "sunset": response.prediccion.dia[0].ocaso,
        }]
    }
    return daily_weather



@flow(name="daily_weather")
def daily_weather(parcelId: str) -> dict:
    try:
        data = extract(parcelId)
        processed_data = transform(data, parcelId)
        return processed_data
    except Exception as e:
        logger = get_run_logger()
        logger.info(str(e))
        return {}

if __name__ == "__main__":
    daily_weather()