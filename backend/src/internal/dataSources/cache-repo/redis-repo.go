package cacherepo

import (
	"context"
	"time"

	"github.com/go-redis/redis/v8"
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

func (srv *redissrv) GetClient() *redis.Client {
	return srv.client
}

func (srv *redissrv) Set(key string, value string, exp time.Duration) error {
	err := srv.client.Set(context.Background(), key, value, exp).Err()
	if err != nil {
		return err
	}
	return nil
}

func (srv *redissrv) Get(key string) (string, error) {
	value, err := srv.client.Get(context.Background(), key).Result()
	if err != nil {
		return "", err
	}
	return value, nil
}

func (srv *redissrv) Delete(key string) error {
	err := srv.client.Del(context.Background(), key).Err()
	if err != nil {
		return err
	}
	return nil
}
