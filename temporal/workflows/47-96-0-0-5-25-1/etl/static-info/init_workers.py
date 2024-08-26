from temporalio.client import Client
from temporalio.worker import Worker
import asyncio
import os
import logging
from concurrent.futures import ThreadPoolExecutor
from meteo_station import MeteoStationWorkflow, extract

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="47-96-0-0-5-25-1")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=10),
                    task_queue="static-info-task-queue",
                    workflows=[MeteoStationWorkflow],
                    activities=[extract])
    logging.info("Starting static-info worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())