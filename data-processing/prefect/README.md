# Prefect

## Data lake

The data lake used is Minio, a S3 compatible object storage. The data lake is used to store the raw data and the processed data. In this case, the data is structure into the following zones ([here](https://dzone.com/articles/data-lake-governance-best-practices)):

- `landing-zone`: temporary zone where the raw data is stored. It doesn't have any metadata attached to it.
- `raw-zone`: zone where the raw data is stored. The data is now structured in folders according to attributes like source and date. Also, the data is now tagged with basic metadata.
- `trusted-zone`: zone where the processed data is stored. Now the data is cleansed, validated or dispose. The data is transformed into a format that is easier to analyze, like parquet.
- `refined-zone`: zone where the processed data is enriched, add some more useful metadata and transformed into a format that is easier to manage and expose. This data is unified and structured in folders according to attributes like purpose, zone, date or other ones.

## Issues

### Get rid of the Prefect logs when running ETLs with multiple tasks

When running ETLs with multiple tasks, the Prefect logs are printed in the console. To get rid of them, we can set the environment variable `PREFECT_LOGGING_LEVEL` to `WARNING`. For example, here to execute a ETL with multiple tasks:

```bash
PREFECT_LOGGING_LEVEL=WARNING python3 -m etl.dtStorage.recintos_almendros_parcels_dt_etl
```
