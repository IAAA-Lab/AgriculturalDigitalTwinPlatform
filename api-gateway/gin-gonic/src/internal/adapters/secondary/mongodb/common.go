package mongodb

import (
	"context"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetDocument[T any](m *mongodbConn, collection string, filter interface{}, opts *options.FindOneOptions) (T, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var result T
	err := m.db.Collection(collection).FindOne(ctx, filter, opts).Decode(&result)
	if err == nil {
		return result, nil
	}
	if err == mongo.ErrNoDocuments {
		return *new(T), apperrors.ErrNotFound
	}
	return result, apperrors.ErrInternal
}

func GetDocuments[T any](m *mongodbConn, collection string, filter interface{}, opts *options.FindOptions) ([]T, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var results []T = []T{}
	cursor, err := m.db.Collection(collection).Find(ctx, filter, opts)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return results, nil
		}
		return nil, apperrors.ErrInternal
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, apperrors.ErrInternal
	}

	if results == nil {
		return nil, apperrors.ErrNotFound
	}
	return results, nil
}

func (m *mongodbConn) InsertDocument(collection string, document interface{}, opts *options.InsertOneOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).InsertOne(ctx, document, opts)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (m *mongodbConn) InsertDocuments(collection string, documents []interface{}, opts *options.InsertManyOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).InsertMany(ctx, documents, opts)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (m *mongodbConn) UpdateDocument(collection string, filter interface{}, update interface{}, opts *options.UpdateOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (m *mongodbConn) DeleteDocument(collection string, filter interface{}, opts *options.DeleteOptions) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	_, err := m.db.Collection(collection).DeleteOne(ctx, filter, opts)
	if err == nil {
		return nil
	}
	if err == mongo.ErrNoDocuments {
		return apperrors.ErrNotFound
	}
	return apperrors.ErrInternal
}

func (m *mongodbConn) CountDocuments(collection string, filter interface{}) (int64, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	count, err := m.db.Collection(collection).CountDocuments(ctx, filter)
	if err != nil {
		return 0, apperrors.ErrInternal
	}
	return count, nil
}

func (m *mongodbConn) AggregateDocuments(collection string, pipeline interface{}, opts *options.AggregateOptions) (interface{}, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(m.timeout)*time.Second)
	defer cancel()
	var results interface{}
	cursor, err := m.db.Collection(collection).Aggregate(ctx, pipeline, opts)
	if err == nil {
		err = cursor.All(ctx, results)
		if results == nil || err != nil {
			return results, apperrors.ErrNotFound
		}
	}
	if err == mongo.ErrNoDocuments || results == nil {
		return results, apperrors.ErrNotFound
	}
	return results, apperrors.ErrInternal
}
