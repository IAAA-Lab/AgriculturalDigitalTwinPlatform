FROM prefecthq/prefect:2.8.4-python3.11

WORKDIR /opt/prefect

RUN pip install --no-cache-dir --upgrade pip && \
  pip install --no-cache-dir minio && \
  pip install --no-cache-dir pymongo && \
  pip install --no-cache-dir pandas && \
  pip install --no-cache-dir openpyxl && \
  pip install --no-cache-dir prefect-jupyter

COPY flows /opt/prefect/flows

ENTRYPOINT ["prefect", "server", "start", "--host", "0.0.0.0"]