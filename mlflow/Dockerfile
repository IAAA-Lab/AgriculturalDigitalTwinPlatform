FROM ghcr.io/mlflow/mlflow:v2.8.1

COPY requirements.txt /tmp/requirements.txt
RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install -r /tmp/requirements.txt