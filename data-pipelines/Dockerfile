FROM python:3.11

COPY requirements.txt /opt/data-pipelines/requirements.txt
WORKDIR /opt/data-pipelines

RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt