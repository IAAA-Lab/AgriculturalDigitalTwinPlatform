package minio

import (
	"bytes"
	"context"
	"log"

	"github.com/gabriel-vasile/mimetype"
	"github.com/minio/minio-go/v7"
)

func (mc *MinioConn) UploadFile(file []byte, fileName string, bucket string, path string) error {
	ctx := context.Background()
	err := mc.client.MakeBucket(ctx, bucket, minio.MakeBucketOptions{})
	if err != nil {
		// Check to see if we already own this bucket (which happens if you run this twice)
		exists, errBucketExists := mc.client.BucketExists(ctx, bucket)
		if errBucketExists == nil && exists {
			log.Printf("Bucket exists")
		} else {
			log.Fatalln(err)
		}
	} else {
		log.Printf("Successfully created bucket")
	}
	content_type := mimetype.Detect(file).String()
	_, err = mc.client.PutObject(ctx, bucket, path+"/"+fileName, bytes.NewReader(file), int64(len(file)), minio.PutObjectOptions{
		ContentType: content_type,
		UserMetadata: map[string]string{
			"x-amz-meta-type": "parcels_and_treatments",
		},
	})
	if err != nil {
		return err
	}
	return nil
}

func (mc *MinioConn) GetFile(fileName string, bucket string, path string) ([]byte, error) {
	ctx := context.Background()
	object, err := mc.client.GetObject(ctx, bucket, path+"/"+fileName, minio.GetObjectOptions{})
	if err != nil {
		return nil, err
	}
	defer object.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(object)
	return buf.Bytes(), nil
}
