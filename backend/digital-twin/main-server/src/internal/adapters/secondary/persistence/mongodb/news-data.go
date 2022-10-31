package mongodb

import (
	"digital-twin/main-server/src/internal/core/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) FetchAll(numPage int64) ([]domain.News, error) {
	findOptions := options.Find().SetProjection(bson.M{"content": 0})
	findOptions.SetSort(bson.M{"date": -1})
	findOptions.SetLimit(6)
	findOptions.SetSkip(6 * numPage)
	news, err := mc.GetDocuments(NEWS_COLLECTION, bson.M{}, findOptions)
	return news.([]domain.News), err
}

func (mc *mongodbConn) Fetch(id primitive.ObjectID) (domain.News, error) {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	news, err := mc.GetDocuments(NEWS_COLLECTION, filter, nil)
	return news.(domain.News), err
}

func (mc *mongodbConn) FetchNumber() (int64, error) {
	return mc.CountDocuments(NEWS_COLLECTION, bson.M{})
}

func (mc *mongodbConn) PostNewNews(news domain.News) error {
	return mc.InsertDocument(NEWS_COLLECTION, news, nil)
}

func (mc *mongodbConn) UpdateNews(id primitive.ObjectID, news domain.News) error {
	update := bson.M{"$set": news}
	filter := bson.M{"_id": bson.M{"$eq": id}}
	return mc.UpdateDocument(NEWS_COLLECTION, filter, update, nil)
}

func (mc *mongodbConn) DeleteNews(id primitive.ObjectID) error {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	return mc.DeleteDocument(NEWS_COLLECTION, filter, nil)
}
