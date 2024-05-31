from forecast_weather_dto import forecast_weather_dto
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
from temporalio.workflow import logger
import asyncio
from datetime import timedelta
from dataclasses import dataclass
import os

with workflow.unsafe.imports_passed_through():
    from aiohttp_client_cache import CachedSession, SQLiteBackend

@dataclass
class Input_Extract:
    enclosureId: str

@activity.defn()
async def extract(input: Input_Extract) -> list[dict]:
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN", "Basic YWdyb3NsYWJzZWN1cmU6NXJwNmFMdlZiNkhV")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL", "http://agroslab.geoslab.com/AgroslabHttpServlet/AgroslabHttpServlet")
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
        "type": "diaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    async with CachedSession(cache=SQLiteBackend()) as session: # Works if activity is local
        # async with aiohttp.ClientSession() as session:
        async with session.post(AGROSLAB_API_URL, json=body, headers=headers, ssl=False) as resp:
            if resp.status != 200:
                raise  Exception(f"Status code: {resp.status} - {input.enclosureId} -> Response: {await resp.text()}")
            data = await resp.json(content_type="text/plain") # content_type is needed because the response is not a json (it's a text/plain)
            return data


@dataclass
class Input_Transform:
    data: list[dict]
    enclosureId: str

@activity.defn()
async def transform(input: Input_Transform) -> dict:
    from jsonschema import validate
    try:
        validate(instance=input.data, schema=forecast_weather_dto)
    except Exception as e:
        raise Exception(f"Error validating the response: {e.message}")
    response = input.data[0]
    # Change forecast_weather to ["..."]
    forecast_weather = {
        "type": "forecast_weather",
        "enclousureId": input.enclosureId,
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
        "prediction": {
            "day": list(map(lambda day: {
                "probPrec": list(map(lambda probPrec: {
                    "value": probPrec.get("value", None),
                    "period": probPrec.get("periodo", None)
                }, day["probPrecipitacion"])),
                "snowQuote": list(map(lambda snowQuote: {
                    "value": snowQuote.get("value", None),
                    "period": snowQuote.get("periodo", None)
                }, day["cotaNieveProv"])),
                "skyState": list(map(lambda skyState: {
                    "value": skyState.get("value", None),
                    "period": skyState.get("periodo", None),
                    "description": skyState.get("descripcion", None)
                }, day["estadoCielo"])),
                "wind": list(map(lambda wind: {
                    "direction": wind.get("direccion", None),
                    "speed": wind.get("velocidad", None),
                    "period": wind.get("periodo", None)
                }, day["viento"])),
                "ta": {
                    "tamax": day.get("temperatura", {}).get("maxima", None),
                    "tamin": day.get("temperatura", {}).get("minima", None)
                },
                "hr": {
                    "hrmax": day.get("humedadRelativa", {}).get("maxima", None),
                    "hrmin": day.get("humedadRelativa", {}).get("minima", None)
                },
                "uvMax": day.get("uvMax", None),
                "date": day["fecha"]
            }, response["prediccion"]["dia"]))
        }
    }
    return forecast_weather

@dataclass
class Input_Run:
    enclosure_id: str


@workflow.defn
class ForecastWeatherWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> dict:
        raw_data = await workflow.execute_local_activity(extract, Input_Extract(input.enclosure_id), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        data = await workflow.execute_local_activity(transform, Input_Transform(raw_data, input.enclosure_id), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
        return data
    
async def main(enclosure_id):
    client = await Client.connect("localhost:7233")
    async with Worker(client, task_queue="forecast-weather-task-queue", workflows=[ForecastWeatherWorkflow], activities=[extract, transform]):
        resp = await client.execute_workflow(
            ForecastWeatherWorkflow.run,
            Input_Run(enclosure_id),
            id=f"forecast-weather-workflow-{enclosure_id}",
            task_queue="forecast-weather-task-queue",
            retry_policy=RetryPolicy(maximum_attempts=1)
        )
    return resp


if __name__ == "__main__":
    asyncio.run(main("50-99-0-0-2-206-1"))
