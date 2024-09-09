package mongodb

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongodbConn struct {
	client  mongo.Client
	timeout int
}

const (
	DIGITAL_TWINS_COLLECTION       = "DigitalTwins"
	WEATHER_COLLECTION             = "Weather"
	NDVI_COLLECTION                = "NDVI"
	FARM_COLLECTION                = "Farm"
	ACTIVITIES_COLLECTION          = "Activities"
	CROP_STATS_COLLECTION          = "Crops"
	PREDICTIONS_COLLECTION         = "Predictions"
	SENSOR_DATA_COLLECTION         = "Sensors"
	NOTIFICATIONS_COLLECTION       = "Notifications"
	NEWS_COLLECTION                = "News"
	USERS_COLLECTION               = "Users"
	SIMULATIONS_RESULTS_COLLECTION = "SimulationResults"
	SIMULATIONS_COLLECTION         = "Simulations"
)

func NewMongodbConn(dbUrl string, timeout int) *mongodbConn {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(dbUrl))
	if err != nil {
		panic(err)
	}
	return &mongodbConn{*mongoClient, timeout}
}
