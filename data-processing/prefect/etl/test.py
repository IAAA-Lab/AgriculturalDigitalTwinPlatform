from prefect import task, flow
import asyncio
import pandas as pd
from etl.__validation__.schemas import activities_schema


@task()
def extract(num):
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
        


if __name__ == "__main__":
    # Fails
    etl_excel("etl/test.xlsx")
    # Works
    # asyncio.run(etl(1))
    # Fails
    # asyncio.run(etl2(0))
    # Works
    # asyncio.run(etl2(1))
