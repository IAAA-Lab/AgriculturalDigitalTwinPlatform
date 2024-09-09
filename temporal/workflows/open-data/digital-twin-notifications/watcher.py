import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from common.functions import DB_MongoClient
from dataclasses import dataclass
import random
import logging
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy
import asyncio
from datetime import timedelta
from typing import Any

logging.basicConfig(level=logging.INFO)

@dataclass
class Input_Evaluate:
    digital_twin_id: str
    value: Any
    type: str


@activity.defn()
async def evaluate_danger(input: Input_Evaluate) -> str:
    # NOTE: Evaluate deeper
    return random.choice(["none", "low", "mid", "serious"])


@dataclass
class Input_Physical_Asset:
    digital_twin_id: str
    value: Any
    type: str
@activity.defn()
async def feedback_physical_asset(input: Input_Physical_Asset) -> None:
    import requests
    # Send feedback to the physical asset depending on type
    match input.type:
        case "water":
            # Rules for water
            if input.value > 60:
                # Send command to not irrigate in the next 12 hours
                body = {
                    "digital_twin_id": input.digital_twin_id,
                    "value": input.value,
                    "type": input.type
                }
                resp = requests.post(f"http://benthos:8056/{input.digital_twin_id}/feedback", json=body)
                if resp.status_code != 200:
                    # TODO: Handle error
                    pass
                else:
                    print("Feedback sent correctly")
                # http://localhost:8056/47-96-0-0-5-20-1/feedback
        case "temperature":
            # Rules for temperature
            if input.value > 30:
                # TODO: Send command to physical asset
                pass
        case _:
            pass

                          
@dataclass
class Input_Near:
    digital_twin_id: str


@activity.defn()
async def get_near_digital_twins(input: Input_Near) -> list[str]:
    db = DB_MongoClient().connect(input.digital_twin_id)
    props = db.Properties.find_one()
    coords = props["geometry"]["coordinates"][0][0]
    filter = {
		"geometry": {
			"$near": {
				"$geometry": {
					"type":        "Point",
					"coordinates": coords,
				},
				"$maxDistance": 300,
			},
		},
	}
    db = DB_MongoClient().connect("common")
    digital_twins = db.DigitalTwins.find(filter)
    digital_twin_ids = [x["id"] for x in digital_twins]
    return digital_twin_ids
        
@dataclass
class Input_Save_Notification:
    digital_twin_id: str
    value: Any
    importance: str

@activity.defn()
async def save_notification(input: Input_Save_Notification):
  import pandas as pd
  db = DB_MongoClient().connect("common")
  timestamp = pd.Timestamp.now()
  db.Notifications.insert_one({
      "timestamp": timestamp,
      "type": "water",
      "value": input.value,
      "importance": input.importance,
      "digitalTwinId": input.digital_twin_id
  })

@dataclass
class Input_Run:
    digital_twin_id: str
    value: Any
    type: str

@workflow.defn
class DigitalTwinNotificationsWorkflow:
    @workflow.run
    async def run(self, input: Input_Run) -> None:
        importance = await workflow.execute_activity(evaluate_danger, Input_Evaluate(input.digital_twin_id, input.value, input.type), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        if importance == "none":
            return
        if importance == "serious":
            await workflow.execute_activity(feedback_physical_asset, Input_Physical_Asset(input.digital_twin_id, input.value, input.type), start_to_close_timeout=timedelta(seconds=15), retry_policy=RetryPolicy(maximum_attempts=2, backoff_coefficient=2))
        digital_twin_ids = await workflow.execute_activity(get_near_digital_twins, Input_Near(input.digital_twin_id), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))
        for digital_twin_id in digital_twin_ids:
            await workflow.execute_activity(save_notification, Input_Save_Notification(digital_twin_id, input.value, importance), start_to_close_timeout=timedelta(seconds=5), retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1))

async def main(enclosure_id: str):
    client = await Client.connect("localhost:7233", namespace="open-data")
    async with Worker(client, task_queue="digital-twin-notifications-task-queue", workflows=[DigitalTwinNotificationsWorkflow], activities=[evaluate_danger, get_near_digital_twins, save_notification]):
        resp = await client.execute_workflow(
                DigitalTwinNotificationsWorkflow.run,
                Input_Run(enclosure_id, 43),
                id=f"digital-twin-notifications",
                task_queue="digital-twin-notifications-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=1)
            )
    return resp

# ---------------- TEST ----------------
if __name__ == "__main__":
    enclosure_id = "50-99-0-0-2-206-1"
    asyncio.run(main(enclosure_id))
