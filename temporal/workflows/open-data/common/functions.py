import os


class DB_Client:
    def connect(self):
        return None


class DB_MinioClient(DB_Client):

    def __init__(self, secure=False, access_key=None, secret_key=None, host=None):
        self.ACCESS_ROOT = os.environ.get(
            "AWS_ACCESS_KEY_ID", "minio") if access_key is None else access_key
        self.SECRET_ROOT = os.environ.get(
            "AWS_SECRET_ACCESS_KEY", "minio123") if secret_key is None else secret_key
        self.MINIO_HOST = os.environ.get(
            "MINIO_HOST", "localhost:9000") if host is None else host
        self.secure = secure

    def connect(self):
        from minio import Minio
        return Minio(self.MINIO_HOST, access_key=self.ACCESS_ROOT,
                     secret_key=self.SECRET_ROOT, secure=self.secure)



class DB_MongoClient(DB_Client):
    def __init__(self, host=None, db=None):
        self.MONGODB_HOST = os.environ.get(
            "MONGO_URI", "mongodb://Hd763nd4873hd3jh:idYtR65bja_56GGVdgd_df87Yh3@localhost:27018/?authMechanism=DEFAULT&authSource=admin") if host is None else host

    def connect(self, db=None):
        from pymongo import MongoClient
        return MongoClient(self.MONGODB_HOST)[db]
