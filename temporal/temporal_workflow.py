import asyncio
import logging
from dataclasses import dataclass
from datetime import timedelta

from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker


# While we could use multiple parameters in the activity, Temporal strongly
# encourages using a single dataclass instead which can have fields added to it
# in a backwards-compatible way.
@dataclass
class ComposeGreetingInput:
    greeting: str
    name: str


# Basic activity that logs and does string concatenation
@activity.defn
async def compose_greeting(input: ComposeGreetingInput) -> str:
    # throw error
    raise ValueError("error")
    await asyncio.sleep(10)
    print("Running activity with parameter %s" % input)
    activity.logger.info("Running activity with parameter %s" % input)
    return f"{input.greeting}, {input.name}!"


# Basic workflow that logs and invokes an activity
@workflow.defn
class GreetingWorkflow:
    @workflow.run
    async def run(self, name: str) -> str:
        workflow.logger.info("Running workflow with parameter %s" % name)
        result = await compose_greeting(ComposeGreetingInput("Hello", name))
        return result


async def main():
    # Uncomment the line below to see logging
    # logging.basicConfig(level=logging.INFO)

    # Start client
    client = await Client.connect("localhost:7233")

    # Run a worker for the workflow
    async with Worker(
        client,
        task_queue="hello-activity-task-queue",
        workflows=[GreetingWorkflow],
        activities=[compose_greeting],
    ):

        # Start a workflow
        tasks = []
        for i in range(1):
            tasks.append(
                client.execute_workflow(
                    GreetingWorkflow.run,
                    "puta",
                    id=f"hello-activity-workflow-id-{i}",
                    task_queue="hello-activity-task-queue",
                )
            )
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main())
