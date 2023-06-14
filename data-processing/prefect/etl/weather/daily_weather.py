from prefect import flow, task, get_run_logger
from prefect.tasks import task_input_hash
from datetime import timedelta
from etl.weather.dto.daily_weather_dto import DailyWeather
import requests as request
import os
# Get rid of insecure warning
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

@task(tags=["agroslab"], retries=2, retry_delay_seconds=3, timeout_seconds=15, cache_key_fn=task_input_hash, cache_expiration=timedelta(minutes=30))
def extract(enclosureId: str):

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
        "type": "horaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = request.post(
        AGROSLAB_API_URL, json=body, headers=headers)
    return response.json()


@task
def transform(data, enclosureId) -> dict:
    response = DailyWeather.from_dict(data[0])
    daily_weather = {
        "type": "daily_weather",
        "enclosureId": enclosureId,
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
            "skyState": list(map(lambda skyState: {
                "value": skyState.value,
                "period": skyState.periodo,
                "description": skyState.descripcion,
            }, response.prediccion.dia[0].estadoCielo)),
            "prec": list(map(lambda prec: {
                "value": prec.value,
                "period": prec.periodo,
            }, response.prediccion.dia[0].precipitacion)),
            "probPrec":list(map(lambda probPrec: {
                "value": probPrec.value,
                "period": probPrec.periodo,
            }, response.prediccion.dia[0].probPrecipitacion)),
            "probStorm": list(map(lambda probStorm: {
                "value": probStorm.value,
                "period": probStorm.periodo,
            }, response.prediccion.dia[0].probTormenta)),
            "snow": list(map(lambda snow: {
                "value": snow.value,
                "period": snow.periodo,
            }, response.prediccion.dia[0].nieve)),
            "probSnow": list(map(lambda probSnow: {
                "value": probSnow.value,
                "period": probSnow.periodo,
            }, response.prediccion.dia[0].probNieve)),
            "ta": list(map(lambda ta: {
                "value": ta.value,
                "period": ta.periodo,
            }, response.prediccion.dia[0].temperatura)),
            "hr": list(map(lambda hr: {
                "value": hr.value,
                "period": hr.periodo,
            }, response.prediccion.dia[0].humedadRelativa)),
            "wind": list(map(lambda wind: {
                "direction": wind.direccion,
                "period": wind.periodo,
                "speed": wind.velocidad,
                "value": wind.value,
            }, response.prediccion.dia[0].vientoAndRachaMax)),
            "date": response.prediccion.dia[0].fecha,
            "dawn": response.prediccion.dia[0].orto,
            "sunset": response.prediccion.dia[0].ocaso,
        }]
    }
    print(daily_weather)
    return daily_weather


@flow(persist_result=True)
def daily_weather(enclosure_id: str) -> dict:
    data = extract(enclosure_id)
    processed_data = transform(data, enclosure_id)
    return processed_data

# ---------------- TEST ----------------


def test_daily_weather(enclosure_id: str):
    data = extract.fn(enclosure_id)
    processed_data = transform.fn(data, enclosure_id)
    return processed_data


if __name__ == "__main__":
    enclosure_id = "44-254-0-0-11-341-12"
    test_daily_weather(enclosure_id)
