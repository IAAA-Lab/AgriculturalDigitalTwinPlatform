package cacherepo

import (
	"time"

	"github.com/go-redis/redis"
)

type redissrv struct {
	client *redis.Client
}

func NewRedisConn(redisUri string) *redissrv {

	if redisUri == "" {
		redisUri = "redis://localhost:6379"
	}

	redisParsedUri, err := redis.ParseURL(redisUri)
	redisClient := redis.NewClient(redisParsedUri)
	if err != nil {
		panic(err)
	}
	return &redissrv{client: redisClient}
}

func (srv *redissrv) Set(key string, value string, exp time.Duration) error {
	err := srv.client.Set(key, value, exp).Err()
	if err != nil {
		return err
	}
	return nil
}

func (srv *redissrv) Get(key string) (string, error) {
	value, err := srv.client.Get(key).Result()
	if err != nil {
		return "", err
	}
	return value, nil
}

func (srv *redissrv) Delete(key string) error {
	err := srv.client.Del(key).Err()
	if err != nil {
		return err
	}
	return nil
}
