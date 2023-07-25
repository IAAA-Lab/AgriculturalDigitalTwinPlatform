#!/bin/bash

# Execute rpc consumer for on-demand etl
python3 -m __consumers__.rpc_consumer &
# Execute direct exchange consumer for event-based etl
python3 -m __consumers__.direct_exchange_consumer &
# Init a project where we will deploy our flows
prefect project init --recipe local
prefect worker start --type process --pool default-work --name default-worker &
sleep 3

# Register blocks
prefect block register -m prefect_email

# Scheduled (weekly every sunday at 00:00 timezone Europe/Madrid)
prefect deploy ./etl/ndvi/ndvi_etl.scheduled.py:ndvi_scheduled_etl --name scheduled --cron "0 0 * * SUN" --timezone Europe/Madrid -p default-work
# prefect deployment build ./etl/ndvi/ndvi_etl.scheduled.py:ndvi_scheduled_etl --name scheduled --cron "0 0 * * SUN" --timezone Europe/Madrid -p default-work --storage-block remote-file-system/minio
prefect deploy ./etl/weather/historical_weather_etl.scheduled.py:historical_weather_scheduled_etl --name scheduled --cron "0 0 * * SUN" --timezone Europe/Madrid -p default-work
# Event-driven (triggered by rpc or direct exchange using amqp)
prefect deploy ./etl/__validation__/validate_raw_data_etl.py:validate_raw_data_etl --name event-driven -p default-work
prefect deploy ./etl/activities/activities_trusted_etl.py:activities_trusted_etl --name event-driven -p default-work
prefect deploy ./etl/activities/activities_dt_etl.py:activities_dt_etl --name event-driven -p default-work
prefect deploy ./etl/recintos_cercanos/recintos_almendros_parcels_trusted_etl.py:recintos_almendros_parcels_trusted_etl --name event-driven -p default-work
prefect deploy ./etl/recintos_cercanos/recintos_almendros_treatments_trusted_etl.py:recintos_almendros_treatments_trusted_etl --name event-driven -p default-work
prefect deploy ./etl/recintos_cercanos/recintos_almendros_parcels_dt_etl.py:recintos_almendros_parcels_dt_etl --name event-driven -p default-work
prefect deploy ./etl/recintos_cercanos/recintos_almendros_treatments_dt_etl.py:recintos_almendros_treatments_dt_etl --name event-driven -p default-work
prefect deploy ./etl/cultivos_identificadores/cultivos_identificadores_dt_etl.py:cultivos_identificadores_dt_etl --name event-driven -p default-work

# Don't exit
tail -f /dev/null
