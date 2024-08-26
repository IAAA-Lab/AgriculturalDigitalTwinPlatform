from temporalio.client import Client
from temporalio.worker import Worker
from forecast_weather import extract, transform, ForecastWeatherWorkflow
import asyncio
import os
import logging
from concurrent.futures import ThreadPoolExecutor

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="open-data")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=20),
                    task_queue="forecast-weather-task-queue",
                    workflows=[ForecastWeatherWorkflow],
                    activities=[extract, transform])
    logging.info("Starting forecast weather worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())