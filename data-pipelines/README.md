# Prefect

## Data lake

The data lake used is Minio, a S3 compatible object storage. The data lake is used to store the raw data and the processed data. In this case, the data is structure into the following zones ([here](https://dzone.com/articles/data-lake-governance-best-practices)):

- `landing-zone`: temporary zone where the raw data is stored. It doesn't have any metadata attached to it. Here, it is validated, and if it is valid, it is moved to the raw zone, otherwise, it is moved to `landing-zone/invalid`.
- `raw-zone`: zone where the raw data is stored. The data is now structured in folders according to attributes like source and date. Also, the data is now tagged with basic metadata.
- `trusted-zone`: zone where the processed data is stored. Now the data is cleansed, validated or dispose. The data is transformed into a format that is easier to analyze, like parquet.
- `refined-zone`: zone where the processed data is enriched, add some more useful metadata and transformed into a format that is easier to manage and expose. This data is unified and structured in folders according to attributes like purpose, zone, date or other ones.

## Create a prefect project and deploy a flow

https://docs.prefect.io/latest/tutorials/projects/

```bash
mkdir my-first-project
cd my-first-project
prefect project init --recipe local
```

```bash
prefect worker start -t process -p local-work &
```

```bash
$ prefect deploy ./api_flow.py:call_api \
    -n my-first-deployment \
    -p local-work
```

## Run the python scripts

We can run the python scripts in the `etl` folder with the following command, from the root folder of the project (as a module):

```bash
python3 -m etl.<module_name>
```

## Debug the python scripts in VSCode

1. Install the [Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python) for VSCode.
2. Place the breakpoints in the python script.
3. Run the script in debug mode: `F5`. Important, only with `F5` is working, not with the debug button in the top bar.

## Machine learning with MLFlow

Mlflow is a platform to manage the machine learning lifecycle. It has a tracking server to track the experiments and a model registry to register the models. It also has a UI to visualize the experiments and the models.

In this moment, we have the following configuration --> MLflow with remote Tracking Server, backend and artifact stores:
- Tracking Server: http://mlflow:5000
- Backend Store: Postgres
- Artifact Store: Minio

### ML ETL lifecycle
To manage the lifecycle of the ML ETLs, we follow the following steps:
1. Create a Juptyer notebook to do offline experiments, log and save the results we like to keep in the tracking server.
2. When we find a good model with the correct parameters, we create a ML ETL to train the model and save it in the model registry.
3. To use the model, we deploy it in the Mlflow Model Server with the command `mlflow models serve -m s3://mlflow/<model_uri> --env-manager local -p 5001 --host 0.0.0.0`. The model is now available in the port 5001. This is only for testing purposes. To query the model, we can use the following command (for instance): `curl http://127.0.0.1:5001/invocations -H 'Content-Type: application/json' -d '{"dataframe_split": {"columns":["fixed acidity","volatile acidity","citric acid","residual sugar","chlorides","free sulfur dioxide","total sulfur dioxide","density","pH","sulphates","alcohol"],"data":[[12.8, 0.029, 0.48, 0.98, 6.2, 29, 3.33, 1.2, 0.39, 75, 0.66]]}}'`.

The `--env-manager local` is used to run the model in the same environment as the one used to train it. This saves the need to install `pyenv` and `pyenv-virtualenv` in the server. The `--host` is used to make the model available in the network when using docker.

4. In order to update the model and retrain it when new data is available, we can schedule and track the ML ETL with Prefect. We also use Mlflow to version the models and track the metrics and parameters.

## Issues

### Get rid of the Prefect logs when running ETLs with multiple tasks

When running ETLs with multiple tasks, the Prefect logs are printed in the console. To get rid of them, we can set the environment variable `PREFECT_LOGGING_LEVEL` to `WARNING`. For example, here to execute a ETL with multiple tasks:

```bash
PREFECT_LOGGING_LEVEL=WARNING python3 -m etl.dtStorage.recintos_almendros_parcels_dt_etl
```

### Mlflow consumes too much memory

When running Mlflow, it consumes too much memory. When deployed to docker, it consumes up to 500 MB of memory.