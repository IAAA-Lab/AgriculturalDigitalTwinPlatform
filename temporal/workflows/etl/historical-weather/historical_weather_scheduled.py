# This is for common functions to be accepted as module imports
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from common.functions import DB_MongoClient
from dataclasses import dataclass

from historical_weather import HistoricalWeatherWorkflow, Input_Run as HistoricalWeatherInputRun, extract, transform, load
from datetime import datetime, timedelta
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio
import logging

logging.basicConfig(level=logging.INFO)

HISTORIC_WEATHER_EXTRACT_FIRST_DATE = datetime(2018, 1, 1)

@activity.defn()
async def extract_distinct_meteo_stations_ids() -> list[str]:
    mongo_client = DB_MongoClient().connect()
    return mongo_client.Enclosures.distinct("meteoStation.idema")

@dataclass
class Input_Extract_Date:
    meteo_station_id: str

@activity.defn()
async def extract_last_known_date(input: Input_Extract_Date) -> str:
    mongo_client = DB_MongoClient().connect()
    # Extract last known date
    last_known_date = mongo_client.Weather.find_one({"idema": input.meteo_station_id}, sort=[("date", -1)])
    if last_known_date:
        return last_known_date["date"].strftime("%d-%m-%Y")
    return HISTORIC_WEATHER_EXTRACT_FIRST_DATE.strftime("%d-%m-%Y")

@dataclass
class Input_Run:
    date_end: str

@workflow.defn
class HistoricalWeatherScheduleWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        meteo_station_ids = await workflow.execute_activity(extract_distinct_meteo_stations_ids, start_to_close_timeout=timedelta(seconds=10), retry_policy=RetryPolicy(maximum_attempts=2))
        # Run in batches of BATCH_SIZE to avoid overloading the server
        for meteo_station_id in meteo_station_ids:
            try:
                last_known_date = await workflow.execute_activity(extract_last_known_date, Input_Extract_Date(meteo_station_id),
                                                                    start_to_close_timeout=timedelta(seconds=10),
                                                                    retry_policy=RetryPolicy(maximum_attempts=2))
                await workflow.execute_child_workflow(HistoricalWeatherWorkflow, HistoricalWeatherInputRun(meteo_station_id, last_known_date, input.date_end),
                                                                id=f"historical-weather-workflow-{meteo_station_id}",
                                                                run_timeout=timedelta(seconds=60 * 30),
                                                                retry_policy=RetryPolicy(maximum_attempts=1))
            except Exception as e:
                logging.error(f"Error in meteo_station_id: {meteo_station_id} - {e}")

async def main():
    client = await Client.connect("localhost:7233")
    date_end = datetime.now().strftime("%d-%m-%Y") # Get all data until today
    async with Worker(client,
                      task_queue="historical-weather-task-queue",
                      workflows=[HistoricalWeatherScheduleWorkflow, HistoricalWeatherWorkflow],
                      activities=[extract_distinct_meteo_stations_ids, extract_last_known_date, extract, transform, load]):
        # Schedule the workflow every Sunday at 00:00
        await client.execute_workflow(
                HistoricalWeatherScheduleWorkflow.run,
                Input_Run(date_end),
                id="historical-weather-scheduled-workflow",
                task_queue="historical-weather-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1),
                # cron_schedule="0 0 * * SUN"
            )

if __name__ == "__main__":
    asyncio.run(main())
