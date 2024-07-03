FROM prefecthq/prefect:2.14.5-python3.11
RUN apt-get update && apt-get install -y libhdf5-serial-dev
COPY requirements.txt /opt/data-pipelines/requirements.txt
WORKDIR /opt/data-pipelines

RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt