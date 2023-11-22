import aiohttp
import asyncio
import time
from prefect import flow

start_time = time.time()


async def get_pokemon(session, url):
    # throw an exception
    # raise Exception("An exception occurred")
    async with session.get(url, timeout=0.0001) as resp:
        pokemon = await resp.json()
        return pokemon['name']
        

# @flow
async def main():

    async with aiohttp.ClientSession() as session:

        tasks = []
        for number in range(1, 151):
            url = f'https://pokeapi.co/api/v2/pokemon/{number}'
            tasks.append(asyncio.ensure_future(get_pokemon(session, url)))

        original_pokemon = await asyncio.gather(*tasks, return_exceptions=True)
        for pokemon in original_pokemon:
            if isinstance(pokemon, Exception):
                print(f"Error getting pokemon - {type(pokemon)}")
                continue


asyncio.run(main())
print("--- %s seconds ---" % (time.time() - start_time))