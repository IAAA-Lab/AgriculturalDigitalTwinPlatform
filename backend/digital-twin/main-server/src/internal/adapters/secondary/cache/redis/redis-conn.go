package redisrepo

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

type redissrv struct {
	client *redis.Client
}

func NewRedisConn(redisUri string) *redissrv {

	if redisUri == "" {
		redisUri = "localhost:6379"
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	if err := redisClient.Ping(context.Background()).Err(); err != nil {
		// panic(err)
		log.Println("Redis connection error: ", err)
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
