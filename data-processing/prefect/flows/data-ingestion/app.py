from prefect import flow, task, get_run_logger, router
import requests


@task
def extract():
    logger = get_run_logger()
    print("extracting data")
    logger.info("extracting data")

    # Extract data from Rest API

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": "50",
        "municipio": "001",
        "type": "diaria"
    }

    headers = {
        'Authorization': 'Basic YWdyb3NsYWJzZWN1cmU6NXJwNmFMdlZiNkhV'
    }

    response = requests.post(
        "http://agroslab.geoslab.com/AgroslabHttpServlet/AgroslabHttpServlet", json=body, headers=headers)

    return response.json()


@flow(name="data-ingestion")
def data_ingestion():
    data = extract()
    logger = get_run_logger()
    logger.info(data)


if __name__ == "__main__":
    data_ingestion()
