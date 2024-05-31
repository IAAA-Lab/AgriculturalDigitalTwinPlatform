#!/bin/bash

python3 /etc/temporal/workflows/etl/daily-weather/init_workers.py &
python3 /etc/temporal/workflows/etl/forecast-weather/init_workers.py &
python3 /etc/temporal/workflows/etl/historical-weather/init_workers.py &
python3 /etc/temporal/workflows/etl/ndvi/init_workers.py &

tail -f /dev/null
