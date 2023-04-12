FROM prefecthq/prefect:2.8.4-python3.11

COPY requirements.txt /opt/prefect/flows/requirements.txt
COPY ./entrypoint.sh / 
WORKDIR /opt/prefect/flows

RUN pip install --no-cache-dir --upgrade pip && \
  pip install -r requirements.txt
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["/entrypoint.sh"]