from prefect import flow, task, get_run_logger, router
import requests
import os


@task
def extract():
    logger = get_run_logger()
    print("extracting data")
    logger.info("extracting data")

    # Extract data from Rest API

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": "50",
        "municipio": "001",
        "type": "diaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, json=body, headers=headers)

    return response.json()


@task
def transform():
    logger = get_run_logger()
    print("transforming data")
    logger.info("transforming data")


@flow(name="data-ingestion")
def data_ingestion():
    data = extract()


if __name__ == "__main__":
    data_ingestion()
