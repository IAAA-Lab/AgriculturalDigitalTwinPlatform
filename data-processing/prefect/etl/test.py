from prefect import task, flow
import asyncio
import pandas as pd
from etl.__validation__.schemas import activities_schema
import requests
from multiprocessing import Pool


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


@task
async def pokemon_api_extract(i, session):
    url = f"https://pokeapi.co/api/v2/pokemon/{i}"
    data = requests.get(url).json()
    await asyncio.sleep(10)
    print(data["name"])
    return data["name"]


@flow
async def execute_pokemon_api_extract(i, session):
    return await pokemon_api_extract(i, session)


@flow
async def pokemon_api_etl():
    session = requests.Session()
    tasks = [execute_pokemon_api_extract(i, session) for i in range(1, 100)]
    await asyncio.gather(*tasks)

    # for i in range(1, 100):
    #     await execute_pokemon_api_extract(i, session)

if __name__ == "__main__":
    asyncio.run(etl2(1, return_state=True))
