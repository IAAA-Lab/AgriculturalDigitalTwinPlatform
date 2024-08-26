from temporalio.client import Client
from temporalio.worker import Worker
import asyncio
import os
import logging
from concurrent.futures import ThreadPoolExecutor
import activities_trusted_etl
import activities_dt_etl
import yield_dt_etl
import yield_trusted_etl

logging.basicConfig(level=logging.INFO)

async def main():
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "temporal:7233")
    client = await Client.connect(temporal_uri, namespace="47-96-0-0-5-20-1")
    worker = Worker(client,
                      workflow_task_executor=ThreadPoolExecutor(max_workers=20),
                      task_queue="activities-task-queue",
                      workflows=[activities_trusted_etl.ActivitiesTrustedWorkflow, activities_dt_etl.ActivitiesDTWorkflow,
                                 yield_trusted_etl.YieldTrustedWorkflow, yield_dt_etl.YieldDTWorkflow],
                      activities=[activities_trusted_etl.extract, activities_trusted_etl.transform, activities_trusted_etl.load,
                                  activities_trusted_etl.clean, activities_trusted_etl.validate, activities_dt_etl.extract,
                                  activities_dt_etl.load, yield_trusted_etl.extract, yield_trusted_etl.transform, yield_trusted_etl.load,
                                  yield_trusted_etl.clean, yield_trusted_etl.validate,
                                  yield_dt_etl.extract, yield_dt_etl.load])
    logging.info("Starting activities worker")
    await worker.run()

if __name__ == "__main__":
    asyncio.run(main())