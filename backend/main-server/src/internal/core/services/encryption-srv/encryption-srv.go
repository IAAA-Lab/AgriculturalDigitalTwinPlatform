package encryptionsrv

import (
	"prakticas/backend-gpsoft/src/internal/core/ports"
)

type service struct {
	encryptionrepository ports.EncryptionRepository
}

func New(encryptionRepository ports.EncryptionRepository) *service {
	return &service{encryptionrepository: encryptionRepository}
}

func (srv *service) EncryptData(data string) (string, error) {
	return srv.encryptionrepository.EncryptData(data)
}

func (srv *service) DecryptData(data string) (string, error) {
	return srv.encryptionrepository.DecryptData(data)
}
