package mongodb

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) FetchAll(numPage int64) ([]domain.News, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	findOptions := options.Find().SetProjection(bson.M{"content": 0})
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

func (mc *mongodbConn) Fetch(id primitive.ObjectID) (domain.News, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"_id": bson.M{"$eq": id}}
	var results domain.News
	err := mc.db.Collection("News").FindOne(ctx, filter).Decode(&results)
	if err != nil {
		return domain.News{}, apperrors.ErrNotFound
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

func (mc *mongodbConn) PostNewNews(news domain.News) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.db.Collection("News").InsertOne(ctx, news)
	if err != nil {
		return apperrors.ErrNotFound
	}
	return nil
}

func (mc *mongodbConn) UpdateNews(id primitive.ObjectID, news domain.News) error {
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
