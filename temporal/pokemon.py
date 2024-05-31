""" import aiohttp
import asyncio
import time

start_time = time.time()


async def get_pokemon(session, url):
    async with session.get(url, ssl=False) as resp:
        pokemon = await resp.json()
        return pokemon['name']


async def main():

    async with aiohttp.ClientSession() as session:
        tasks = []
        for number in range(1, 151):
            url = f'https://pokeapi.co/api/v2/pokemon/{number}'
            tasks.append(asyncio.ensure_future(get_pokemon(session, url)))

        original_pokemon = await asyncio.gather(*tasks)
        for pokemon in original_pokemon:
            print(pokemon)

asyncio.run(main())
print("--- %s seconds ---" % (time.time() - start_time)) """

# Convert the above code to use Temporal
from dataclasses import dataclass
from datetime import timedelta
import time

import aiohttp
import asyncio
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker
from temporalio.common import RetryPolicy

with workflow.unsafe.imports_passed_through():
    import requests
    import requests_cache
    from aiohttp_client_cache import CachedSession, SQLiteBackend

@dataclass
class Input:
    url: str


@activity.defn(name="get_pokemon")
async def get_pokemon(input: Input) -> str:
    # async with CachedSession(cache=SQLiteBackend()) as session: # Works if activity is local
    async with aiohttp.ClientSession() as session:
        # raise Exception("This is an exception")
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
                workflow.execute_local_activity(
                    get_pokemon,
                    Input(url),
                    start_to_close_timeout=timedelta(seconds=20),
                    retry_policy=RetryPolicy(maximum_attempts=1, backoff_coefficient=1)
                )
            )
        original_pokemon = await asyncio.gather(*tasks)
        for pokemon in original_pokemon:
            print(pokemon)
        return original_pokemon


async def main():
    client = await Client.connect("localhost:7233")
    async with Worker(client, task_queue="pokemon-activity-task-queue", workflows=[PokemonWorkflow], activities=[get_pokemon]):
        workflows = []
        for i in range(10):
            workflows.append(client.execute_workflow(
                PokemonWorkflow.run,
                id=f"pokemon-workflow-id-{i}",
                task_queue="pokemon-activity-task-queue",
                retry_policy=RetryPolicy(maximum_attempts=3, backoff_coefficient=5)
            ))
        res = await asyncio.gather(*workflows)
        for r in res:
            for pokemon in r:
                print(pokemon)
        """        res = await client.execute_workflow(
                    PokemonWorkflow.run,
                    id=f"pokemon-workflow-id-17",
                    task_queue="pokemon-activity-task-queue-5"
                )
                for pokemon in res:
                    print(pokemon) """

if __name__ == "__main__":
    start_time = time.time()
    asyncio.run(main())
    print("--- %s seconds ---" % (time.time() - start_time))  # 1.5 seconds
