package services

import (
	"digital-twin/main-server/src/internal/core/ports"
)

type fileDumpService struct {
	storageRepository ports.StorageRepository
}

func NewFileDumpService(storageRepository ports.StorageRepository) *fileDumpService {
	return &fileDumpService{storageRepository: storageRepository}
}

func (s *fileDumpService) GetFile(fileName string, bucket string, path string) ([]byte, error) {
	return s.storageRepository.GetFile(fileName, bucket, path)
}

func (srv *fileDumpService) UploadFile(file []byte, fileName string, bucket string, path string, metadata map[string]string) error {
	return srv.storageRepository.UploadFile(file, fileName, bucket, path, metadata)
}
