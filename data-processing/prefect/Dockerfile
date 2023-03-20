FROM prefecthq/prefect:2.8.4-python3.11

COPY requirements.txt /opt/prefect/requirements.txt
WORKDIR /opt/prefect

RUN pip install --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt

COPY flows /opt/prefect/flows

ENTRYPOINT ["prefect", "server", "start", "--host", "0.0.0.0"]