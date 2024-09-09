#!/bin/bash
# open-data
python3 /etc/temporal/workflows/open-data/daily-weather/init_workers.py &
python3 /etc/temporal/workflows/open-data/forecast-weather/init_workers.py &
python3 /etc/temporal/workflows/open-data/historical-weather/init_workers.py &
python3 /etc/temporal/workflows/open-data/ndvi/init_workers.py &
python3 /etc/temporal/workflows/open-data/digital-twin-notifications/init_workers.py &
# 47-96-0-0-5-25-1
python3 /etc/temporal/workflows/47-96-0-0-5-25-1/etl/static-info/init_workers.py &
python3 /etc/temporal/workflows/47-96-0-0-5-25-1/etl/activities/init_workers.py &
# 47-96-0-0-5-20-1
python3 /etc/temporal/workflows/47-96-0-0-5-20-1/etl/static-info/init_workers.py &
python3 /etc/temporal/workflows/47-96-0-0-5-20-1/etl/activities/init_workers.py &
python3 /etc/temporal/workflows/47-96-0-0-5-20-1/prediction/init_workers.py &
python3 /etc/temporal/workflows/47-96-0-0-5-20-1/simulations/init_workers.py &

tail -f /dev/null
