FROM prefecthq/prefect:2.10.20-python3.11

COPY requirements.txt /opt/prefect/requirements.txt
COPY ./entrypoint.sh / 
WORKDIR /opt/prefect

RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]