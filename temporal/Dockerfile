FROM python:3.10-slim-buster

COPY requirements.txt /tmp/requirements.txt
RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install h5py --only-binary h5py && \
  pip install -r /tmp/requirements.txt