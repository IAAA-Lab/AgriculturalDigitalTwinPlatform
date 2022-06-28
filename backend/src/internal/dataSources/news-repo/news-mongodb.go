package newsrepo

import (
	"context"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (mc *mongodbConn) FetchAll(numPage int64) ([]domain.News, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	findOptions := options.Find()
	findOptions.SetSort(bson.D{{"date", -1}})
	findOptions.SetLimit(6)
	findOptions.SetSkip(6 * numPage)
	cursor, err := mc.db.Collection("News").Find(ctx, bson.D{}, findOptions)
	if err != nil {
		return []domain.News{}, apperrors.ErrNotFound
	}
	var results []domain.News
	if err = cursor.All(context.TODO(), &results); err != nil {
		return []domain.News{}, apperrors.ErrInternal
	}
	return results, nil
}

func (mc *mongodbConn) Fetch(id primitive.ObjectID) (domain.Description, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"_id": bson.M{"$eq": id}}
	var results domain.Description
	err := mc.db.Collection("News").FindOne(ctx, filter).Decode(&results)
	if err != nil {
		return domain.Description{}, apperrors.ErrNotFound
	}
	return results, nil
}

func (mc *mongodbConn) FetchNumber() (int64, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	number, err := mc.db.Collection("News").CountDocuments(ctx, bson.D{})
	if err != nil {
		return 0, apperrors.ErrNotFound
	}
	return number, nil
}

func (mc *mongodbConn) PostNewNews(news domain.PostNews) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.db.Collection("News").InsertOne(ctx, news)
	if err != nil {
		return apperrors.ErrNotFound
	}
	return nil
}

func (mc *mongodbConn) UpdateNews(id primitive.ObjectID, news domain.PostNews) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	update := bson.D{{
		"$set", news,
	}}
	_, err := mc.db.Collection("News").UpdateByID(ctx, id, update)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (mc *mongodbConn) DeleteNews(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"_id": bson.M{"$eq": id}}
	_, err := mc.db.Collection("News").DeleteOne(ctx, filter)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}
