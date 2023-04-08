package minio

import (
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type MinioConn struct {
	client *minio.Client
}

func NewMinioConn(endpoint string, accessKeyID string, secretAccessKey string, useSSL bool) *MinioConn {
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		panic(err)
	}
	return &MinioConn{minioClient}
}
