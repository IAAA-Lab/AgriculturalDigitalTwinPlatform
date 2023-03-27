import os
from minio import Minio

class DB_Client:
   def connect(self):
    return None

class DB_MinioClient(DB_Client):

    def __init__(self, secure=False, access_key=None, secret_key=None, host=None):
      self.ACCESS_ROOT = os.environ.get("PREFECT_MINIO_ACCESS_ROOT") if access_key is None else access_key
      self.SECRET_ROOT = os.environ.get("PREFECT_MINIO_SECRET_ROOT") if secret_key is None else secret_key
      self.MINIO_HOST = os.environ.get("PREFECT_MINIO_HOST") if host is None else host
      self.secure = secure

    def connect(self):
      return Minio(self.MINIO_HOST, access_key=self.ACCESS_ROOT,
                   secret_key=self.SECRET_ROOT, secure=self.secure)