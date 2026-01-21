FROM python:3.10-slim-bullseye

RUN apt-get clean && rm -rf /var/lib/apt/lists/* && \
  apt-get update && apt-get install -y --no-install-recommends \
  libhdf5-serial-dev && \
  rm -rf /var/lib/apt/lists/*

COPY requirements.txt /tmp/requirements.txt
RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install h5py --only-binary h5py && \
  pip install -r /tmp/requirements.txt