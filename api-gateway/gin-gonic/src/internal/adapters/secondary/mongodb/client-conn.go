package mongodb

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongodbConn struct {
	client  mongo.Client
	db      mongo.Database
	timeout int
}

const (
	ENCLOSURES_COLLECTION    = "Enclosures"
	USER_PARCELS_COLLECTION  = "UserParcels"
	WEATHER_COLLECTION       = "Weather"
	NDVI_COLLECTION          = "NDVI"
	FARM_COLLECTION          = "Farm"
	ACTIVITIES_COLLECTION    = "Activities"
	CROP_STATS_COLLECTION    = "Crops"
	SENSOR_DATA_COLLECTION   = "SensorData"
	NOTIFICATIONS_COLLECTION = "Notifications"
	NEWS_COLLECTION          = "News"
	USERS_COLLECTION         = "Users"
)

func NewMongodbConn(dbUrl string, dbName string, timeout int) *mongodbConn {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(dbUrl))
	if err != nil {
		panic(err)
	}
	mongoDb := mongoClient.Database(dbName)
	return &mongodbConn{*mongoClient, *mongoDb, timeout}
}
