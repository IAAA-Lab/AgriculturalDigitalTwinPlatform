from prefect import task, flow
import io
import pandas as pd
import numpy as np
from utils.functions import DB_MinioClient, DB_MongoClient
from utils.constants import Constants


FILE_PATH = ""
FILE_NAME = "FakeCropStats.xlsx"
BUCKET_FROM_NAME = Constants.STORAGE_LANDING_ZONE.value

def generate_random_date(init_date: pd.Timestamp, end_date: pd.Timestamp):
    # If init_date is greater than end_date, sum 1 year to end_date
    if init_date > end_date:
        end_date = end_date + pd.DateOffset(years=1)
    # Generate random date between init_date and end_date
    random_date = pd.to_datetime(np.random.randint(
        init_date.value, end_date.value))
    return random_date

def generate_random_number(number_range: str):
    # Format is: "400-700"
    splitted_number_range = number_range.split("-")
    init_number = int(splitted_number_range[0])
    end_number = int(splitted_number_range[1])
    # Generate random number between init_number and end_number
    random_number = np.random.randint(init_number, end_number)
    return random_number


@task
def extract():
    # Connect to MinIO
    minio_client = DB_MinioClient().connect()
    data = minio_client.get_object(
        BUCKET_FROM_NAME, f"{FILE_PATH}/{FILE_NAME}").read()
    return pd.read_excel(io.BytesIO(data), engine="openpyxl")


@task
def get_unique_enclosure_ids_and_crops_from_db():
    # Connect to MongoDB
    db = DB_MongoClient().connect()
    # Get unique pairs of enclosure_id and crop_name from Crops collection
    enclosures_and_crops = db.Crops.aggregate([
        {
                        # Choose which not have mocked property
            "$match": {
                "mocked": {
                    "$exists": False
                }
            },
        },
        {
            "$group": {
                "_id": {
                    "enclosureId": "$enclosureId",
                    "cropName": "$cropName"
                }
            }
        }
    ])
    # Convert cursor to list
    enclosures_and_crops = list(enclosures_and_crops)
    return enclosures_and_crops

@task
def transform(df: pd.DataFrame, enclosures_and_crops: list):
    # I have the following excel file with the following columns:
    #     Cultivo Cultivo id Fecha de siembra (avg)	Fecha de cosecha (avg)	Rendimiento (avg) (Kg/Ha)
    #     ALMENDRO 104	01/03-31/05	20/08-30/09	400-700

    # I need to, randomly, generate a planting date and a harvest date for each crop between the ranges given in the excel file, also I need to generate performance values between the ranges given in the excel file.
    # These dates will be between 2015 and 2022.

    INIT_YEAR = 2015
    END_YEAR = 2022

    crops = []

    for enclosure_and_crop in enclosures_and_crops:
            enclosure_id = enclosure_and_crop["_id"]["enclosureId"]
            crop_name = enclosure_and_crop["_id"]["cropName"]
            crop = df.loc[df["Cultivo"] == crop_name]
            if crop.empty:
                continue
            planting_date_raw = crop["Fecha de siembra (avg)"].values[0]
            harvest_date_raw = crop["Fecha de cosecha (avg)"].values[0]
            performance_raw = crop["Rendimiento (avg) (Kg/Ha)"].values[0]
            for year in range(INIT_YEAR, END_YEAR + 1):
                # Generate planting date
                planting_date_from = pd.to_datetime(f"{planting_date_raw.split('-')[0]}/{year}", format="%d/%m/%Y")
                planting_date_to = pd.to_datetime(f"{planting_date_raw.split('-')[1]}/{year}", format="%d/%m/%Y")
                planting_date = generate_random_date(planting_date_from, planting_date_to)
                
                # Generate harvest date
                harvest_date_from = pd.to_datetime(f"{harvest_date_raw.split('-')[0]}/{year}", format="%d/%m/%Y")
                harvest_date_to = pd.to_datetime(f"{harvest_date_raw.split('-')[1]}/{year}", format="%d/%m/%Y")
                harvest_date = generate_random_date(harvest_date_from, harvest_date_to)
            
                # Generate performance
                performance = generate_random_number(performance_raw)

                crops.append({
                    "enclosureId": enclosure_id,
                    "cropName": crop_name,
                    "plantingDate": planting_date,
                    "harvestDate": harvest_date,
                    "performance": performance,
                    "mocked": True,
                })

    return crops

@task
def load(crops: list):
    # Connect to MongoDB
    db = DB_MongoClient().connect()

    # Delete all crops with "mocked" property set to True
    db.Crops.delete_many({"mocked": True})
    # Add crops properties to "properties" object in Enclosures collection
    db.Crops.insert_many(crops)


@flow(name="crops_production_etl_mock")
def crops_production_etl_mock():
    df = extract()
    enclosures_and_crops = get_unique_enclosure_ids_and_crops_from_db()
    crops = transform(df, enclosures_and_crops)
    load(crops)

if __name__ == "__main__":
    crops_production_etl_mock()