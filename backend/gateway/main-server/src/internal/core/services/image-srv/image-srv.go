package services

import (
	"digital-twin/main-server/src/internal/core/ports"

	"github.com/google/uuid"
)

type service struct {
	imageRepository ports.FileStorageRepository
}

func New(imageRepository ports.FileStorageRepository) *service {
	return &service{imageRepository: imageRepository}
}

func (s *service) GetFile(fileName string, path string) ([]byte, error) {
	return s.imageRepository.GetFile(fileName, path)
}

func (srv *service) UploadFile(img []byte, path string) (string, error) {
	return srv.imageRepository.UploadImage(img, uuid.New().String()+".png", path)
}

func (srv *service) DeleteFile(fileName string, path string) error {
	return srv.imageRepository.DeleteFile(fileName, path)
}
