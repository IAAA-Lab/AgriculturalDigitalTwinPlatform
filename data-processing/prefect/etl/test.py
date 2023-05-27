from prefect import task, flow
import asyncio

@task()
async def extract(num):
    asyncio.sleep(1)
    return [1/num]

@task()
async def transform(data):
    return [i + 1 for i in data]

@task()
async def load(data):
    print(f"Here's your data: {data}")

@flow
async def etl(num):
    e = extract.submit(num).result(raise_on_failure=False)
    # check if e is an Exception
    if isinstance(e, Exception):
        print("Failed!")
    t = transform.submit(e).result(raise_on_failure=False)
    if isinstance(t, Exception):
        return
    await load(t)

@flow
async def etl2(num):
    # With asyncio.gather check for Exceptions
    e = await asyncio.gather(extract(num), return_exceptions=True)
    if isinstance(e[0], Exception):
        print("Failed!")
        return
    t = await asyncio.gather([transform(e[0])], return_exceptions=True)
    if isinstance(t[0], Exception):
        return
    await load(t[0])

    
if __name__ == "__main__":
    # Fails
    # asyncio.run(etl(0))
    # Works
    # asyncio.run(etl(1))
    # Fails
    # asyncio.run(etl2(0))
    # Works
    # asyncio.run(etl2(1))
    pass
