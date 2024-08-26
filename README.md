# Digital Twin for agrarian exploitations

## What is a Digital Twin?


## What is this project about?


## Architecture

The architecture of the project is the following:

![Architecture](./docs/images/tech_arch.png)

## Deployment

### Local deployment

In order to execute the project locally, you need to have installed the following tools:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Visual Studio Code](https://code.visualstudio.com/download) for the sake of simplicity

Actually it has been tested in MacOS, but it should work in Linux and Windows as well. It make use of the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for Visual Studio Code, so you need to install it as well. The Docker option `Dev Environments (BETA)` is used to create the development environment. It takes the `docker-compose.yml` file and creates the containers. The `devcontainer.json` file is used to configure the development environment. If you want to develop inside a container, through the dev environment, you have an option to attach to an existing container and it uses de `devcontainer` option in Visual Studio code. In this case, no deppendencies need to be installed globally, but in the container.

To execute it if not using the dev environment, you need to execute the following command:

```bash
docker-compose up --build -p digital-twin-local
```

#### golang cli

This applies to all types of deployments. A golang bash cli is provided to execute some actions. To execute it you need to execute the following command:

```bash
./project-cli.sh
```

### Development deployment

To execute it you need to execute the following command:

```bash
docker-compose -f docker-compose.dev.yml -p digital-twin-dev --env-file .env.dev up --build
```

### Production deployment

To execute it you need to execute the following command:

```bash
docker-compose -f docker-compose.prod.yml -p digital-twin-prod --env-file .env.prod up --build
```

## Secrets

Secrets, for the moment, are stored in its respective env file (`.env`, `.env.dev`, `.env.prod`), but it is not a good practice. It is better to store them in a secret manager, like [Vault](https://www.vaultproject.io/). In the future, it will be implemented. This files are injected to its respective container through the `docker-compose.yml` files.

## Future work (or not)

- <https://blog.min.io/lakehouse-architecture-iceberg-minio/>
- <https://www.arecadata.com/high-performance-open-source-data-lakehouse-at-home/>


## Guide for example project

### Requirements

- [Temporal CLI](https://docs.temporal.io/cli)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- 

### Before starting

- Start docker compose
- Add images to minio
- Temporal file organization

To organize temporal workflows, we have decided to make a folder for each digital twin. Inside each folder, we have the following structure:

```bash
.
├── 47-124-0-0-1-53-1
│   ├── common
│   ├── etl
│   ├── ml-training
│   ├── prediction
│   └── simulations
├── 47-96-0-0-5-20-1
│   ├── common
│   ├── etl
│   ├── ml-training
│   ├── prediction
│   └── simulations
└── open-data
    ├── common
    ├── daily-weather
    ├── forecast-weather
    ├── historical-weather
    └── ndvi
```

Each folder corresponds to a digital twin and the open data etl is a folder for the open data etl workflows. As open data is common to all digital twins, it is in a separate folder. It includes weather, ndvi, satellyte image processing workflows, etc. Inside each digital twin folder we have the etl workflows of close data, including holding activities, crop status, statistics like harvest, production or static information regarding the holding.

This is for a local non-production use, where these workflows may not be in the host machine, they can be made in other local machines and then register both workflows and workers in the Temporal server. In this case, we are going to use the Temporal CLI to register the workflows and workers. In Temporal, a feature called namespaces exists, and we are using it to separate the workflows and workers of each digital twin. The namespace is the same as the digital twin identifier.

We are going to register a namespace for the open data processing:

```bash
docker exec -it temporal tctl --namespace open-data namespace register
```

To register the workflows, we need to run the workers, which are registered in the corresponding namespace. Right now, there is no authentication or security, but, in a production environment, every namespace should be protected and temporal has JWT authentication and claimers regarding the namespace. The following script is to register the workers and each one is an independent process. We created a docker container in which we allocated some resources to run the workers. The following script is to run the workers for each digital twin and it should be executed in the temporal-worker container:

```bash
# open-data
docker exec -it temporal-worker python3 /etc/temporal/workflows/open-data/daily-weather/init_workers.py &
docker exec -it temporal-worker python3 /etc/temporal/workflows/open-data/forecast-weather/init_workers.py &
docker exec -it temporal-worker python3 /etc/temporal/workflows/open-data/historical-weather/init_workers.py &
docker exec -it temporal-worker python3 /etc/temporal/workflows/open-data/ndvi/init_workers.py &
# 47-124-0-0-1-53-1
docker exec -it temporal-worker python3 /etc/temporal/workflows/47-124-0-0-1-53-1/etl/static-info/init_workers.py &
# 47-96-0-0-5-20-1
docker exec -it temporal-worker python3 /etc/temporal/workflows/47-96-0-0-5-20-1/etl/static-info/init_workers.py &
```

Recommendation is, when digital twins are created, to create a script to register the workers and workflows every time the docker containers are started. We are going to do it in an `entrypoint.sh` in the temporal-worker container.

Also, to use `db.watch` in mongodb, we need to create a replica set. To do it, we need to create a keyfile and a replica set. The following script is to create the keyfile:

```bash
openssl rand -base64 756 > storage/mongodb/mongo-keyfile.key
chmod 600 storage/mongodb/mongo-keyfile.key
```

sudo nginx -s stop


### Login

### Create two new digital twins

We need the file which contains the crop identifiers and set the nearest meteorological station.

```go
// Create a new database in mongodb with name digital-twin-id using mongodb go driver
// Create a new namespace in Temporal with name digital-twin-id using go sdk
// Add digital twin to DigitalTwins collection in the common database
```

### Schedule data ingestion and execute it on demand

Let's create a schedule to ingest ndvi and historical weather data every Sunday at 00:00. We can do it through the CLI or the UI. This will take every digital twin in the platform and execute the ingestion for each one of them. The following images are from the UI: 

![alt text](<Screen Shot 2024-07-16 at 16.16.42.png>)

![alt text](<Screen Shot 2024-07-16 at 16.16.50.png>)

The following temporal CLI commands are the equivalent to the UI actions:

```bash
temporal schedule create \
    --namespace 'open-data' \
    --schedule-id 'schedule-id-historical-weather-scheduled-workflow' \
    --cron '0 0 * * SUN' \
    --workflow-id 'historical-weather-scheduled-workflow' \
    --task-queue 'historical-weather-task-queue' \
    --type 'HistoricalWeatherScheduleWorkflow'
```

```bash
temporal schedule create \
    --namespace 'open-data' \
    --schedule-id 'schedule-id-ndvi-scheduled-workflow' \
    --cron '0 0 * * SUN' \
    --workflow-id 'ndvi-scheduled-workflow' \
    --task-queue 'ndvi-task-queue' \
    --type 'NDVIScheduledWorkflow'
```

![alt text](<Screen Shot 2024-07-16 at 11.16.50.png>)

Now that the schedules are created, we can execute them on demand. We are going to execute it now in order to see all the historical data.
In this case, ndvi endpoint is slow and it is going to take a while, several minutes, up to 30 minutes.

```bash
temporal schedule trigger --schedule-id 'schedule-id-historical-weather-scheduled-workflow'
temporal schedule trigger --schedule-id 'schedule-id-ndvi-scheduled-workflow'
```

Or we can trigger it using the UI:

![alt text](<Screen Shot 2024-07-16 at 11.40.09.png>)


### Add files to ingest

Now, to complete the context of the holding, we are going to add some activities of the digital twins and information about the harvest. Information, as it can be in real life, is diverse and heterogeneous. In the last case, ndvi and historical weather data are ingested from a REST API. This information is contained in Excel and JSON files. We are going to add them to the platform.

To do that

### Show pages with new data

### Add streaming source and connect with frontend

### Fake a flooding and let the digital twin detect it

### Build a predictive model and register them

```bash
MLFLOW_TRACKING_URI=http://mlflow:5000 MLFLOW_S3_ENDPOINT_URL=http://minio:9000 AWS_ACCESS_KEY_ID=minio AWS_SECRET_ACCESS_KEY=minio123  mlflow models serve -m runs:/0131cac7cdc74fa4bac6802fe9b7a1ea/yield_model -p 5001 -h 0.0.0.0 --no-conda
```

```bash
2024/07/23 12:35:36 INFO mlflow.models.flavor_backend_registry: Selected backend for flavor 'python_function'
2024/07/23 12:35:36 INFO mlflow.pyfunc.backend: === Running command 'exec gunicorn --timeout=60 -b 0.0.0.0:5001 -w 1 ${GUNICORN_CMD_ARGS} -- mlflow.pyfunc.scoring_server.wsgi:app'
[2024-07-23 12:35:36 +0000] [112] [INFO] Starting gunicorn 21.2.0
[2024-07-23 12:35:36 +0000] [112] [INFO] Listening at: http://0.0.0.0:5001 (112)
[2024-07-23 12:35:36 +0000] [112] [INFO] Using worker: sync
[2024-07-23 12:35:36 +0000] [113] [INFO] Booting worker with pid: 113
2024/07/23 12:35:38 WARNING mlflow.utils.requirements_utils: Detected one or more mismatches between the model's dependencies and the current Python environment:
 - mlflow (current: 2.10.2, required: mlflow==2.14.3)
 - numpy (current: 1.26.4, required: numpy==1.26.1)
 - packaging (current: 23.2, required: packaging==23.0)
 - psutil (current: uninstalled, required: psutil==5.9.4)
 - scikit-learn (current: 1.5.1, required: scikit-learn==1.3.2)
 - scipy (current: 1.14.0, required: scipy==1.11.3)
To fix the mismatches, call `mlflow.pyfunc.get_model_dependencies(model_uri)` to fetch the model's environment and install dependencies using the resulting environment file.
2024/07/23 12:35:38 WARNING mlflow.pyfunc: The version of Python that the model was saved in, `Python 3.11.5`, differs from the version of Python that is currently running, `Python 3.10.12`, and may be incompatible
/usr/local/lib/python3.10/site-packages/sklearn/base.py:376: InconsistentVersionWarning: Trying to unpickle estimator DecisionTreeRegressor from version 1.3.2 when using version 1.5.1. This might lead to breaking code or invalid results. Use at your own risk. For more info please refer to:
https://scikit-learn.org/stable/model_persistence.html#security-maintainability-limitations
  warnings.warn(
/usr/local/lib/python3.10/site-packages/sklearn/base.py:376: InconsistentVersionWarning: Trying to unpickle estimator RandomForestRegressor from version 1.3.2 when using version 1.5.1. This might lead to breaking code or invalid results. Use at your own risk. For more info please refer to:
https://scikit-learn.org/stable/model_persistence.html#security-maintainability-limitations
  warnings.warn(
```

### According to the model, send feedback to the digital twin

### Schedule model retraining

### Build a simulation

### Delete digital twin

```bash
temporal operator namespace delete <digital-twin-id>
```
