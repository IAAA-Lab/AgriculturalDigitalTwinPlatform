from dataclasses import dataclass
import aiohttp
from daily_weather_dto import daily_weather_dto
import os

import logging
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio
from datetime import timedelta

logging.basicConfig(level=logging.INFO)

with workflow.unsafe.imports_passed_through():
    from aiohttp_client_cache import CachedSession, SQLiteBackend

@dataclass
class Input_Extract:
    enclosureId: str


@activity.defn()
async def extract(input: Input_Extract) -> list[dict]:
    
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    API_URL = os.environ.get("AGROSLAB_API_URL")
    # Extract data from Rest API
    municipality = input.enclosureId.split("-")[1]
    if len(municipality) == 1:
        municipality = "00" + municipality
    elif len(municipality) == 2:
        municipality = "0" + municipality

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": input.enclosureId.split("-")[0],
        "municipio": municipality,
        "type": "horaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    async with CachedSession(cache=SQLiteBackend()) as session: # Works if activity is local
        # async with aiohttp.ClientSession() as session:
        async with session.post(API_URL, json=body, headers=headers, ssl=False) as resp:
            if resp.status != 200:
                raise Exception(f"Status code: {resp.status} - {input.enclosureId} -> Response: {await resp.text()}")
            data = await resp.json(content_type="text/plain") # content_type is needed because the response is not a json (it's a text/plain)
            return data
        
@dataclass
class Input_Trasform:
    data: list[dict]
    enclosureId: str

@activity.defn()
async def transform(input: Input_Trasform) -> dict:
    from jsonschema import validate
    try:
        validate(instance=input.data, schema=daily_weather_dto)
    except Exception as e:
        raise Exception(f"Error validating the response: {e.message}")
    response = input.data[0]
    daily_weather = {
        "type": "daily_weather",
        "enclosureId": input.enclosureId,
        "origin": {
            "producer": response["origen"]["productor"],
            "web": response["origen"]["web"],
            "language": response["origen"]["language"],
            "copyright": response["origen"]["copyright"],
            "legalNote": response["origen"]["notaLegal"],
        },
        "elaboratedAt": response["elaborado"],
        "province": response["provincia"],
        "municipality": response["nombre"],
        "prediction": [{
            "skyState": list(map(lambda skyState: {
                "value": skyState.get("value", None),
                "period": skyState.get("periodo", None),
                "description": skyState.get("descripcion", None),
            }, response["prediccion"]["dia"][0]["estadoCielo"])),
            "prec": list(map(lambda prec: {
                "value": prec.get("value", None),
                "period": prec.get("periodo", None),
            }, response["prediccion"]["dia"][0]["precipitacion"])),
            "probPrec": list(map(lambda probPrec: {
                "value": probPrec.get("value", None),
                "period": probPrec.get("periodo", None),
            }, response["prediccion"]["dia"][0]["probPrecipitacion"])),
            "probStorm": list(map(lambda probStorm: {
                "value": probStorm.get("value", None),
                "period": probStorm.get("periodo", None),
            }, response["prediccion"]["dia"][0]["probTormenta"])),
            "snow": list(map(lambda snow: {
                "value": snow.get("value", None),
                "period": snow.get("periodo", None),
            }, response["prediccion"]["dia"][0]["nieve"])),
            "probSnow": list(map(lambda probSnow: {
                "value": probSnow.get("value", None),
                "period": probSnow.get("periodo", None),
            }, response["prediccion"]["dia"][0]["probNieve"])),
            "ta": list(map(lambda ta: {
                "value": ta.get("value", None),
                "period": ta.get("periodo", None),
            }, response["prediccion"]["dia"][0]["temperatura"])),
            "hr": list(map(lambda hr: {
                "value": hr.get("value", None),
                "period": hr.get("periodo", None),
            }, response["prediccion"]["dia"][0]["humedadRelativa"])),
            "wind": list(map(lambda wind: {
                "direction": wind.get("direccion", None),
                "period": wind.get("periodo", None),
                "speed": wind.get("velocidad", None),
                "value": wind.get("value", None),
            }, response["prediccion"]["dia"][0]["vientoAndRachaMax"])),
            "date": response["prediccion"]["dia"][0]["fecha"],
            "dawn": response["prediccion"]["dia"][0]["orto"],
            "sunset": response["prediccion"]["dia"][0]["ocaso"],
        }]
    }
    return daily_weather

@dataclass
class Input_Run:
    enclosure_id: str

@workflow.defn
class DailyWeatherWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> dict:
        raw_data = await workflow.execute_local_activity(extract, Input_Extract(input.enclosure_id), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        data = await workflow.execute_local_activity(transform, Input_Trasform(raw_data, input.enclosure_id), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
        return data

async def main(enclosure_id: str):
    client = await Client.connect("localhost:7233", namespace="open-data")
    async with Worker(client, task_queue="daily-weather-task-queue", workflows=[DailyWeatherWorkflow], activities=[extract, transform]):
        resp = await client.execute_workflow(
                DailyWeatherWorkflow.run,
                Input_Run(enclosure_id),
                id=f"daily-weather-workflow-{enclosure_id}",
                task_queue="daily-weather-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1)
            )
    return resp

# ---------------- TEST ----------------
if __name__ == "__main__":
    enclosure_id = "50-99-0-0-2-206-1"
    asyncio.run(main(enclosure_id))
