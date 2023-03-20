package filedumpsrv

import (
	"digital-twin/main-server/src/internal/core/ports"
)

type service struct {
	fileDumpRepository ports.StorageRepository
}

func New(fileDumpRepository ports.StorageRepository) *service {
	return &service{fileDumpRepository: fileDumpRepository}
}

func (s *service) GetFile(fileName string, path string) ([]byte, error) {
	// return s.fileDumpRepository.(fileName, path)
	return nil, nil
}

func (srv *service) UploadFile(file []byte, fileName string, path string) (string, error) {
	return "", srv.fileDumpRepository.UploadFile(file, fileName, "")
}
