package minio

import (
	"bytes"
	"context"
	"log"

	"github.com/gabriel-vasile/mimetype"
	"github.com/minio/minio-go/v7"
)

func (mc *MinioConn) UploadFile(file []byte, fileName string, path string) error {
	ctx := context.Background()
	err := mc.client.MakeBucket(ctx, mc.bucket, minio.MakeBucketOptions{})
	if err != nil {
		// Check to see if we already own this bucket (which happens if you run this twice)
		exists, errBucketExists := mc.client.BucketExists(ctx, mc.bucket)
		if errBucketExists == nil && exists {
			log.Printf("Bucket exists")
		} else {
			log.Fatalln(err)
		}
	} else {
		log.Printf("Successfully created bucket")
	}
	content_type := mimetype.Detect(file).String()
	_, err = mc.client.PutObject(ctx, mc.bucket, path+"/"+fileName, bytes.NewReader(file), int64(len(file)), minio.PutObjectOptions{
		ContentType: content_type,
	})
	if err != nil {
		return err
	}
	return nil
}
