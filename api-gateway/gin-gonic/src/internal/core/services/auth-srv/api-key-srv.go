package authsrv

import (
	"digital-twin/main-server/src/internal/core/ports"
)

type apiKeyService struct {
	store ports.CacheService
}

func APIKeyAuthService(store ports.CacheService, apiKeyRepository ports.APIKeyRepository) ports.APIKeyService {
	return &apiKeyService{
		store: store,
	}
}

func (srv *apiKeyService) GenerateAPIKey() (string, error) {
	// TODO: implemented
	return "", nil
}

func (srv *apiKeyService) ValidateAPIKey(value string) error {
	// TODO: implement
	return nil
}
