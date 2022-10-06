package cachesrv

import (
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"time"
)

type cacheService struct {
	cachesrv ports.CacheRepository
}

func New(cachesrv ports.CacheRepository) *cacheService {
	return &cacheService{
		cachesrv: cachesrv,
	}
}

func (cacheService *cacheService) Get(key string) (string, error) {
	return cacheService.cachesrv.Get(key)
}

func (cacheService *cacheService) Set(key string, value string, exp time.Duration) error {
	return cacheService.cachesrv.Set(key, value, exp)
}

func (cacheService *cacheService) Delete(key string) error {
	return cacheService.cachesrv.Delete(key)
}
