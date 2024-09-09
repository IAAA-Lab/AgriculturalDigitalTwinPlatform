FROM python:3.11.9-slim

COPY requirements.txt /tmp/requirements.txt
RUN pip install --default-timeout=100 --no-cache-dir --upgrade pip && \
  pip install h5py --only-binary h5py && \
  pip install -r /tmp/requirements.txt