from concurrent.futures import ThreadPoolExecutor
from temporalio.client import Client
from temporalio.worker import Worker
from daily_weather import extract, transform, DailyWeatherWorkflow
import asyncio
import os
import logging

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="open-data")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=20),
                    task_queue="daily-weather-task-queue",
                    workflows=[DailyWeatherWorkflow],
                    activities=[extract, transform])
    logging.info("Starting daily weather worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())