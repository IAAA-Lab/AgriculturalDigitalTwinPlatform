from concurrent.futures import ThreadPoolExecutor
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from temporalio.client import Client
from temporalio.worker import Worker
from historical_weather import extract, transform, load, HistoricalWeatherWorkflow
from historical_weather_scheduled import HistoricalWeatherScheduleWorkflow, extract_distinct_meteo_stations_ids, extract_last_known_date
import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri)
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=100),
                    task_queue="historical-weather-task-queue",
                    workflows=[HistoricalWeatherScheduleWorkflow, HistoricalWeatherWorkflow],
                    activities=[extract_distinct_meteo_stations_ids, extract_last_known_date, extract, transform, load])
    logging.info("Starting historical weather worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())