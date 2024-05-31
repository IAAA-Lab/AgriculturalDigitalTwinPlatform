from concurrent.futures import ThreadPoolExecutor
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from temporalio.client import Client
from temporalio.worker import Worker
from ndvi import extract, transform, load, NDVIWorkflow
from ndvi_scheduled import NDVIScheduledWorkflow, extract_enclosures_ids, extract_last_known_date
import asyncio
import logging

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri)
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=100),
                    task_queue="ndvi-task-queue",
                    workflows=[NDVIWorkflow, NDVIScheduledWorkflow],
                    activities=[extract, transform, load, extract_enclosures_ids, extract_last_known_date])
    logging.info("Starting ndvi worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())