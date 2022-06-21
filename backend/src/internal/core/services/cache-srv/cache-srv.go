package cachesrv

import (
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"time"
)

type service struct {
	cachesrv ports.CacheRepository
}

func New(cachesrv ports.CacheRepository) *service {
	return &service{
		cachesrv: cachesrv,
	}
}

func (service *service) Get(key string) (string, error) {
	return service.cachesrv.Get(key)
}

func (service *service) Set(key string, value string, exp time.Duration) error {
	return service.cachesrv.Set(key, value, exp)
}

func (service *service) Delete(key string) error {
	return service.cachesrv.Delete(key)
}
