import json

import os

from .dto.pistacho_dto import Pistachio
from prefect import flow, task, get_run_logger
from pymongo import MongoClient
import jsonschema

from ..utils import functions

FILE_NAME = "ERP/unknown/pistacho.json"

# EXECUTE: python3 -m etl.dtStorage.pistacho_dt_etl

@task
def extract():
    logger = get_run_logger()
    # Connect to MinIO
    minio_client = functions.DB_MinioClient().connect()
    # Get pistacho.json from MinIO and deserialize it
    pistacho_json_data = minio_client.get_object(
        "trusted-zone", FILE_NAME).read().decode("utf-8")
    pistacho_json = json.loads(pistacho_json_data)
    return pistacho_json


@task
def extract_model_schema():
    logger = get_run_logger()
    # Get model schema from MinIO and deserialize it
    minio_client = functions.DB_MinioClient().connect()
    model_schema = minio_client.get_object(
        "model-schemas", "json/farm.json").read().decode("utf-8")
    model_schema = json.loads(model_schema)
    return model_schema


@task
def transform(json_data: dict, model_schema):
    logger = get_run_logger()
    # Convert json to json compatible with model schema
    farm_input = Pistachio.from_dict(json_data)
    logger.info(farm_input)
    farm = {
            "healthAdvisor":  map(lambda ha: 
            {
                "hadId": ha.HAd_Id,
                "name": ha.Name,
                "NIFCode": ha.NIF_Code,
                "ROPOCode": ha.ROPO_Code,
                "carnetType": ha.Carnet_Type
            },
              farm_input.Farm.HeatlhAdvisor),
            "healthApplicator": map(lambda ha:
            # TODO: convert to bson datetime
            {
                "description": ha.Description,
                "ROMACode": ha.ROMA_Code,
                "adquisitionDate": ha.Adquisition_Date,
                "lastInspectionDate": ha.Last_Inspection_Date,
                "haId": ha.HA_Id
            },
              farm_input.HealthApplicator),
            "farmHolder": {
                "name": farm_input.Farm.FarmHolder.Name,
                "idCode": map(lambda idc:
                {
                    "type": idc.Type,
                    "code": idc.Code
                },
                  farm_input.Farm.FarmHolder.Identifier_Code),
                "address": {
                    "street": farm_input.Farm.FarmHolder.Address.Street,
                    "village": farm_input.Farm.FarmHolder.Address.Village,
                    "province": farm_input.Farm.FarmHolder.Address.Province,
                    "ZIP": farm_input.Farm.FarmHolder.Address.ZIP
                },
                "phone": farm_input.Farm.FarmHolder.Phone,
                "email": farm_input.Farm.FarmHolder.Email
            },
    }
    # Validate json against model schema
    jsonschema.validate(farm, model_schema)
    logger.info(farm)
    return json_data


@task
def load(processed_data):
    logger = get_run_logger()

    # Connect to MongoDB
    MONGODB_HOST = os.environ.get("PREFECT_MONGODB_HOST")
    MONGODB_DB = os.environ.get("PREFECT_MONGODB_DB")
    mongo_client = MongoClient(MONGODB_HOST)
    # Get MongoDB database and collection
    db = mongo_client[MONGODB_DB]
    collection = db["Farm"]
    # Store processed data in MongoDB
    collection.update_one({
        "farmId": processed_data["Farm"]["Farm_Id"],
    }, {"$set": processed_data}, upsert=True)


@flow(name="pistacho_refined_etl")
def pistacho_dt_etl():
    json_data = extract()
    model_schema = extract_model_schema()
    processed_data = transform(json_data, model_schema)
    load(processed_data)


if __name__ == "__main__":
    pistacho_dt_etl()


# ---------------------------------------------------------- #
