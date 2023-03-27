FROM prefecthq/prefect:2.8.4-python3.11

COPY requirements.txt /opt/prefect/flows/requirements.txt
WORKDIR /opt/prefect/flows

RUN pip install --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt

ENTRYPOINT ["prefect", "server", "start", "--host", "0.0.0.0"]