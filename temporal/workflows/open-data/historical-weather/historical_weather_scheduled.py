from temporalio import activity, workflow
# This is for common functions to be accepted as module imports
with workflow.unsafe.imports_passed_through():
    import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.functions import DB_MongoClient
from dataclasses import dataclass

from historical_weather import HistoricalWeatherWorkflow, Input_Run as HistoricalWeatherInputRun, create_sequences, extract, transform, load
from datetime import datetime, timedelta
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio
import logging

logging.basicConfig(level=logging.INFO)

HISTORIC_WEATHER_EXTRACT_FIRST_DATE = datetime(2018, 1, 1)

@activity.defn()
async def extract_distinct_meteo_stations_ids() -> list[dict]:
    mongo_client = DB_MongoClient().connect("common")
    pp = mongo_client.DigitalTwins.aggregate([{"$group": {"_id": "$properties.meteostation.idema", "digital_twin_id": {"$push": "$id"}}}])
    meteo_station_ids = [{"meteo_station_id": x["_id"], "digital_twin_ids": x["digital_twin_id"]} for x in pp]
    return meteo_station_ids

@dataclass
class Input_Extract_Date:
    digital_twin_id: str

@activity.defn()
async def extract_last_known_date(input: Input_Extract_Date) -> str:
    mongo_client = DB_MongoClient().connect(input.digital_twin_id)
    # Extract last known date
    last_known_date = mongo_client.Weather.find_one(sort=[("date", -1)])
    if last_known_date:
        return last_known_date["date"].strftime("%d-%m-%Y")
    return HISTORIC_WEATHER_EXTRACT_FIRST_DATE.strftime("%d-%m-%Y")

@workflow.defn
class HistoricalWeatherScheduleWorkflow:
    @workflow.run
    async def run(self) -> None:
        date_end = workflow.now().strftime("%d-%m-%Y") # Get all data until today
        meteo_station_ids = await workflow.execute_activity(extract_distinct_meteo_stations_ids,
                                                            start_to_close_timeout=timedelta(seconds=10),
                                                            retry_policy=RetryPolicy(maximum_attempts=2))
        # # Run in batches of BATCH_SIZE to avoid overloading the server
        for meteo_station_id in meteo_station_ids:
            try:
                last_known_date = await workflow.execute_activity(extract_last_known_date, Input_Extract_Date(meteo_station_id["digital_twin_ids"][0]),
                                                                    start_to_close_timeout=timedelta(seconds=10),
                                                                    retry_policy=RetryPolicy(maximum_attempts=2))
                await workflow.execute_child_workflow(HistoricalWeatherWorkflow, HistoricalWeatherInputRun(meteo_station_id["meteo_station_id"],
                                                                meteo_station_id["digital_twin_ids"], last_known_date, date_end),
                                                                id=f"historical-weather-workflow-{meteo_station_id['meteo_station_id']}",
                                                                run_timeout=timedelta(seconds=60 * 30),
                                                                retry_policy=RetryPolicy(maximum_attempts=1))
            except Exception as e:
                logging.error(f"Error in meteo_station_id: {meteo_station_id} - {e}")

async def main():
    client = await Client.connect("localhost:7233", namespace="open-data")
    async with Worker(client,
                      task_queue="historical-weather-task-queue",
                      workflows=[HistoricalWeatherScheduleWorkflow, HistoricalWeatherWorkflow],
                      activities=[create_sequences, extract_distinct_meteo_stations_ids, extract_last_known_date, extract, transform, load]):
        # Schedule the workflow every Sunday at 00:00
        await client.execute_workflow(
                HistoricalWeatherScheduleWorkflow.run,
                id="historical-weather-scheduled-workflow",
                task_queue="historical-weather-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1),
            )

if __name__ == "__main__":
    asyncio.run(main())
