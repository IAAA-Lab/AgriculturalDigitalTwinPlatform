from prefect import task, flow
import asyncio
import pandas as pd
from etl.__validation__.schemas import activities_schema
import requests
from multiprocessing import Pool
import httpx


@task()
async def extract(num):
    return [1/num]


@task()
async def transform(data):
    raise Exception("Error")
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
    try:
        e = await extract(num)
        t = await transform(e)
        await load(t)
    except Exception as e:
        print(e)


def etl_excel(file_name: str):
    xlsx = pd.ExcelFile(file_name)
    df = pd.read_excel(xlsx.io, sheet_name=None,
                       engine="openpyxl", na_values=[''])
    print(type(df))
    # Loop through sheets
    for sheet_name, sheet_df in df.items():
        print(sheet_name)
        # print(sheet_df.columns)
        df = activities_schema.validate(sheet_df)
        df = df.rename(columns={
            "FECHA": "date",
            "TAREA-PRODUCTO-DOSIS": "activity",
            "RECINTO ID": "enclosureId",
        })
        # Drop rows with undefined activity, date or parcel
        df = df.dropna(subset=["activity", "date", "enclosureId"])
        # Drop duplicates
        df = df.drop_duplicates()
        # Select columns
        df = df[["date", "activity", "enclosureId"]]
        # Convert date to datetime
        df["date"] = pd.to_datetime(df["date"], format="%d/%m/%Y")
        print(df)
        print(df.columns)


async def pokemon_api_extract(i, session):
    url = f"https://pokeapi.co/api/v2/pokemon/{i}"
    data = await session.get(url)
    return data.json()

@flow
async def pokemon_api_etl():
    session = httpx.AsyncClient()
    tasks = [pokemon_api_extract(i, session) for i in range(1, 100)]
    await asyncio.gather(*tasks)
    await session.aclose()

    # for i in range(1, 100):
    #     await execute_pokemon_api_extract(i, session)

def my_task_completion_hook(task, task_run, state):
    print("Our task completed successfully!")

def my_task_failure_hook(task, task_run, state):
    print(task_run.task_inputs["param"])

@task(on_completion=[my_task_completion_hook], on_failure=[my_task_failure_hook])
def my_task(param):
    raise Exception(param)

@flow
def my_flow():
    my_task.submit(param="foo")

if __name__ == "__main__":
    # Start time seconds
    init = pd.Timestamp.now()
    asyncio.run(pokemon_api_etl())
    # End time
    end = pd.Timestamp.now()
    # Time elapsed in seconds
    print((end - init).total_seconds())
