from concurrent.futures import ThreadPoolExecutor
from temporalio.client import Client
from temporalio.worker import Worker
from watcher import DigitalTwinNotificationsWorkflow, evaluate_danger, get_near_digital_twins, save_notification, feedback_physical_asset
import asyncio
import os
import logging

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="open-data")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=200),
                    task_queue="digital-twin-notifications-task-queue",
                    workflows=[DigitalTwinNotificationsWorkflow],
                    activities=[evaluate_danger, get_near_digital_twins, save_notification, feedback_physical_asset])
    logging.info("Starting notifications worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())