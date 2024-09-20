import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.functions import DB_MongoClient
import asyncio
from watcher_workflow import WatcherWorkflow
from temporalio.client import Client
from temporalio.common import RetryPolicy
import uuid
from watcher_workflow import Input_Run

async def main():
    digital_twin_id = "47-96-0-0-5-20-1"
    # mongo change streams
    client = DB_MongoClient().connect(digital_twin_id)
    change_stream = client.Sensors.watch([
        {"$match": {"fullDocument.threat": "high"}}
    ])
    # Temporal client
    temporal_uri = os.environ.get("TEMPORAL_ADDRESS", "localhost:7233")
    client = await Client.connect(temporal_uri, namespace=digital_twin_id)
    for change in change_stream:
        # Run workflow in mode "fire-and-forget" to not wait for workflow completion
        await client.execute_workflow(
            WatcherWorkflow.run,
                Input_Run(change["fullDocument"]["value"], change["fullDocument"]["type"]),
                id=f"digital-twin-watcher-{uuid.uuid1()}",
                task_queue="digital-twin-watcher-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2)
        )

# ---------------- TEST ----------------
if __name__ == "__main__":
    asyncio.run(main())
