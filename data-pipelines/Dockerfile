FROM python:3.11

COPY requirements.txt /opt/data-pipelines/requirements.txt

WORKDIR /opt/data-pipelines

RUN chmod -R 0644 /opt/data-pipelines

RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt

RUN apt-get update && apt-get -y install cron

RUN crontab -l | { cat; echo "0 0 * * 7 /usr/local/bin/python3 -m /opt/data-pipelines/etl/ndvi/ndvi_etl.scheduled"; } | crontab -
RUN crontab -l | { cat; echo "5 0 * * 7 /usr/local/bin/python3 -m /opt/data-pipelines/etl/weather/historical_weather_etl.scheduled"; } | crontab -

CMD ["cron", "-f"]
