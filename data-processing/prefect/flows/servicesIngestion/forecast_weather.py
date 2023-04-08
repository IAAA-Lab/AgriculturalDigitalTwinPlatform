from prefect import flow, task, get_run_logger
from .dto.forecast_weather_dto import ForecastWeather
import requests
import os


@task
def extract(enclosureId: str):
    print(enclosureId)

    # Extract data from Rest API

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    municipality = enclosureId.split("-")[1]
    if len(municipality) == 1:
        municipality = "00" + municipality
    elif len(municipality) == 2:
        municipality = "0" + municipality

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": enclosureId.split("-")[0],
        "municipio": municipality,
        "type": "diaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, json=body, headers=headers)

    return response.json()


@task
def transform(data, enclosureId) -> dict:
    logger = get_run_logger()
    print("transforming data")
    logger.info("transforming data")
    response = ForecastWeather.from_dict(data[0])
    forecast_weather = {
        "type": "forecast_weather",
        "enclosureId": enclosureId,
        "origin": {
            "producer": response.origen.productor,
            "web": response.origen.web,
            "language": response.origen.language,
            "copyright": response.origen.copyright,
            "legalNote": response.origen.notaLegal,
        },
        "elaboratedAt": response.elaborado,
        "municipality": response.nombre,
        "province": response.provincia,
        "prediction": {
            "day": map(lambda day: {
                "probPrec": map(lambda probPrec: {
                    "value": probPrec.value,
                    "period": probPrec.periodo
                }, day.probPrecipitacion),
                "snowQuote": map(lambda snowQuote: {
                    "value": snowQuote.value,
                    "period": snowQuote.periodo
                }, day.cotaNieveProv),
                "skyState": map(lambda skyState: {
                    "value": skyState.value,
                    "period": skyState.periodo,
                    "description": skyState.descripcion
                }, day.estadoCielo),
                "wind": map(lambda wind: {
                    "direction": wind.direccion,
                    "speed": wind.velocidad,
                    "period": wind.periodo
                }, day.viento),
                "ta": {
                    "tamax": day.temperatura.maxima,
                    "tamin": day.temperatura.minima
                },
                "hr": {
                    "hrmax": day.humedadRelativa.maxima,
                    "hrmin": day.humedadRelativa.minima
                },
                "uvMax": day.uvMax,
                "date": day.fecha
            }, response.prediccion.dia)
        }
    }
    return forecast_weather


@flow(name="forecast_weather")
def forecast_weather(enclosureId: str) -> dict:
    data = extract(enclosureId)
    processed_data = transform(data, enclosureId)
    return processed_data


if __name__ == "__main__":
    forecast_weather()
