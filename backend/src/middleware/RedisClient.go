package middleware

import "github.com/go-redis/redis"

func SetUpRedisClient(redisUri string) *redis.Client {

	if redisUri == "" {
		redisUri = "http://localhost:6379"
	}

	redisClient := redis.NewClient(&redis.Options{
		Addr:     redisUri,
		Password: "", // no password set
		DB:       0,  // use default DB
	})
	_, err := redisClient.Ping().Result()
	if err != nil {
		panic(err)
	}
	return redisClient
}
