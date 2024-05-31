# @@@SNIPSTART python-money-transfer-project-template-run-worker
import asyncio
import logging
from dataclasses import dataclass
from datetime import timedelta

from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
import aiohttp

# While we could use multiple parameters in the activity, Temporal strongly
# encourages using a single dataclass instead which can have fields added to it
# in a backwards-compatible way.


@dataclass
class ComposeGreetingInput:
    greeting: str
    name: str


@dataclass
class Input:
    url: str
# Basic activity that logs and does string concatenation


@activity.defn
async def compose_greeting(input: ComposeGreetingInput) -> str:
    activity.logger.info("Running activity with parameter %s" % input)
    return f"{input.greeting}, {input.name}!"

# While we could use multiple parameters in the activity, Temporal strongly
# encourages using a single dataclass instead which can have fields added to it
# in a backwards-compatible way.


@dataclass
class ComposeGreetingInput:
    greeting: str
    name: str

# Basic workflow that logs and invokes an activity


@activity.defn
async def get_pokemon(input: Input) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(input.url, ssl=False) as resp:
            pokemon = await resp.json()
            return pokemon['name']


@workflow.defn
class PokemonWorkflow:
    @workflow.run
    async def run(self) -> list[str]:
        tasks = []
        for number in range(1, 151):
            url = f'https://pokeapi.co/api/v2/pokemon/{number}'
            tasks.append(
                workflow.execute_activity(
                    get_pokemon,
                    Input(url),
                    start_to_close_timeout=timedelta(seconds=20)
                )
            )
        original_pokemon = await asyncio.gather(*tasks)
        for pokemon in original_pokemon:
            print(pokemon)
        return original_pokemon


@workflow.defn
class GreetingWorkflow:
    @workflow.run
    async def run(self, name: str) -> str:
        workflow.logger.info("Running workflow with parameter %s" % name)
        return await workflow.execute_activity(
            compose_greeting,
            ComposeGreetingInput("Hello", name),
            start_to_close_timeout=timedelta(seconds=10),
        )


async def main() -> None:
    client: Client = await Client.connect("localhost:7233", namespace="default")
    # Run the workers with asyncio tasks
    await Worker(
        client,
        task_queue="hello-activity-task-queue",
        workflows=[GreetingWorkflow],
        activities=[compose_greeting],
    ).run()


if __name__ == "__main__":
    asyncio.run(main())
# @@@SNIPEND
