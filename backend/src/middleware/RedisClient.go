package middleware

import (
	"fmt"

	"github.com/go-redis/redis"
)

func SetUpRedisClient(redisUri string) *redis.Client {

	if redisUri == "" {
		redisUri = "redis://localhost:6379"
	}

	redisParsedUri, err := redis.ParseURL(redisUri)
	redisClient := redis.NewClient(redisParsedUri)
	fmt.Println(redisClient)
	if err != nil {
		panic(err)
	}
	return redisClient
}
