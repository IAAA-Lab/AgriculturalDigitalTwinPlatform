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

func NewMongodbConn(dbUrl string, dbName string, timeout int) *mongodbConn {
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(dbUrl))
	mongoDb := mongoClient.Database(dbName)
	if err != nil {
		panic(err)
	}
	return &mongodbConn{*mongoClient, *mongoDb, timeout}
}
