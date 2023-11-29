#!/bin/bash

# Start the process to execute flow from the ui
prefect init --recipe local
prefect worker start --type process --pool default --name default --limit 10 --prefetch-seconds 20 &
# Deploy flows
prefect deploy ./etl/ndvi/ndvi_etl_scheduled.py:ndvi_scheduled_etl --name scheduled --cron "0 0 * * SUN" --timezone Europe/Madrid -p default
prefect deploy ./etl/weather/historical_weather_etl_scheduled.py:historical_weather_scheduled_etl --name scheduled --cron "0 0 * * SUN" --timezone Europe/Madrid -p default

python3 -m __consumers__.direct_exchange_consumer &
python3 -m __consumers__.rpc_consumer &

tail -f /dev/null
