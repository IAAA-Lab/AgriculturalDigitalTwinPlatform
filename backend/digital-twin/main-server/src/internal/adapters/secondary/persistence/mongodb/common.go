package mongodb

import (
	"context"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (m *mongodbConn) GetDocument(collection string, filter interface{}, opts *options.FindOneOptions) (interface{}, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var result interface{}
	err := m.db.Collection(collection).FindOne(ctx, filter, opts).Decode(result)
	return result, err
}

func (m *mongodbConn) GetDocuments(collection string, filter interface{}, opts *options.FindOptions) (interface{}, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var results interface{}
	cursor, err := m.db.Collection(collection).Find(ctx, filter, opts)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return results, apperrors.ErrNotFound
		}
		return results, apperrors.ErrInternal
	}
	err = cursor.All(ctx, &results)
	if results == nil {
		return results, apperrors.ErrNotFound
	}
	return results, err
}

func (m *mongodbConn) InsertDocument(collection string, document interface{}, opts *options.InsertOneOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).InsertOne(ctx, document, opts)
	return err
}

func (m *mongodbConn) InsertDocuments(collection string, documents []interface{}, opts *options.InsertManyOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).InsertMany(ctx, documents, opts)
	return err
}

func (m *mongodbConn) UpdateDocument(collection string, filter interface{}, update interface{}, opts *options.UpdateOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).UpdateOne(ctx, filter, update, opts)
	return err
}

func (m *mongodbConn) DeleteDocument(collection string, filter interface{}, opts *options.DeleteOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).DeleteOne(ctx, filter, opts)
	return err
}

func (m *mongodbConn) CountDocuments(collection string, filter interface{}) (int64, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	count, err := m.db.Collection(collection).CountDocuments(ctx, filter)
	return count, err
}

func (m *mongodbConn) AggregateDocuments(collection string, pipeline interface{}, opts *options.AggregateOptions) (interface{}, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var results interface{}
	cursor, err := m.db.Collection(collection).Aggregate(ctx, pipeline, opts)
	if err != nil {
		return nil, err
	}
	err = cursor.All(ctx, results)
	if results == nil {
		return results, apperrors.ErrNotFound
	}
	return results, err
}
