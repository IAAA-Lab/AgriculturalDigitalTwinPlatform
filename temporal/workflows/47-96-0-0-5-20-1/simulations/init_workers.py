from temporalio.client import Client
from temporalio.worker import Worker
import asyncio
import os
import logging
from concurrent.futures import ThreadPoolExecutor
from harvest_ai_simulation import HarvestAiSimulationWorkflow, run_simulation, create_simulation

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="47-96-0-0-5-20-1")
    worker = Worker(client,
                    workflow_task_executor=ThreadPoolExecutor(max_workers=30),
                    task_queue="harvest-simulation-task-queue",
                    workflows=[HarvestAiSimulationWorkflow],
                    activities=[run_simulation, create_simulation])
    logging.info("Starting harvest 47-96-0-0-5-20-1 simulation worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())