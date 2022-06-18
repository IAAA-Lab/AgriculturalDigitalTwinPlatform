package middleware

import (
	"fmt"

	"github.com/go-redis/redis"
)

func SetUpRedisClient(redisUri string) *redis.Client {

	fmt.Println("redisUri: ", redisUri)
	if redisUri == "" {
		redisUri = "localhost:6379"
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	_, err := redisClient.Ping().Result()
	if err != nil {
		panic(err)
	}
	return redisClient
}
