from datetime import timedelta
import os
from dataclasses import dataclass
from temporalio import activity, workflow
from temporalio.common import RetryPolicy
import asyncio
from temporalio.client import Client
from temporalio.worker import Worker

@dataclass
class Input_Extract:
    enclosure_id: str

@activity.defn()
async def extract(input: Input_Extract) -> dict:
    from aiohttp_client_cache import CachedSession, SQLiteBackend
    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")
    enclosureId = input.enclosure_id
    body = {
        "operation": "aemetestacionesdwithin",
        "id": enclosureId,
        "distanceinkilometers": 100,
    }
    headers = {
        'Authorization': AUTH_TOKEN,
    }
    async with CachedSession(cache=SQLiteBackend(expire_after=60*60*24)) as session: # Works if activity is local
    # async with aiohttp.ClientSession() as session:
        async with session.post(AGROSLAB_API_URL, json=body, headers=headers, ssl=False) as resp:
            if resp.status != 200:
                raise Exception(f"Status code: {resp.status} - {input.enclosure_id} -> Response: {await resp.text()}")
            data = await resp.json(content_type="application/json")
            return min(data["aemet_estaciones"], key=lambda x: x["distancia (km)"])
    

@dataclass
class Input_Run:
    enclosure_id: str

@workflow.defn
class MeteoStationWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        # Extract
        meteo_station_info = await workflow.execute_activity(extract, Input_Extract(enclosure_id=input.enclosure_id), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        return {
            "idema": meteo_station_info["id"],
            "name": meteo_station_info["nombre"],
            "distance": meteo_station_info["distancia (km)"]
        }
    
# This is the main function that will be executed by the Temporal worker
async def main(enclosure_id: str):
    client = await Client.connect("localhost:7233", namespace="47-96-0-0-5-20-1")
    async with Worker(client,
                    task_queue="static-info-task-queue",
                    workflows=[MeteoStationWorkflow],
                    activities=[extract]):
        await client.execute_workflow(MeteoStationWorkflow.run,
                                      Input_Run(enclosure_id=enclosure_id),
                                      id=f"static-info-{os.urandom(4).hex()}",
                                      task_queue="static-info-task-queue",
                                      retry_policy=RetryPolicy(maximum_attempts=1))

if __name__ == "__main__":
    enclosure_id = "47-96-0-0-5-20-1"
    asyncio.run(main(enclosure_id))