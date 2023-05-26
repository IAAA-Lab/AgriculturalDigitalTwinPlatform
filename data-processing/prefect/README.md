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

## Issues

### Get rid of the Prefect logs when running ETLs with multiple tasks

When running ETLs with multiple tasks, the Prefect logs are printed in the console. To get rid of them, we can set the environment variable `PREFECT_LOGGING_LEVEL` to `WARNING`. For example, here to execute a ETL with multiple tasks:

```bash
PREFECT_LOGGING_LEVEL=WARNING python3 -m etl.dtStorage.recintos_almendros_parcels_dt_etl
```

