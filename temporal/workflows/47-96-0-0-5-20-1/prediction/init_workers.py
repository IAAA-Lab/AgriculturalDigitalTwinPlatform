from temporalio.client import Client
from temporalio.worker import Worker
import asyncio
import os
import logging
from concurrent.futures import ThreadPoolExecutor
from harvest_ai_prediction import HarvestAIPredictionWorkflow, get_data, train_model, predict_yield, load_prediction

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="47-96-0-0-5-20-1")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=20),
                    task_queue="harvest-ai-prediction-task-queue",
                    workflows=[HarvestAIPredictionWorkflow],
                    activities=[get_data, train_model, predict_yield, load_prediction])
    logging.info("Starting harvest prediction worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())