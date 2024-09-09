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

func (mc *mongodbConn) PostNewUser(user domain.User) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.client.Database("common").Collection(USERS_COLLECTION).InsertOne(ctx, user)
	return err
}

func (mc *mongodbConn) FetchUserByEmail(email string) (domain.User, error) {
	filter := bson.M{"email": bson.M{"$eq": email}}
	var user domain.User
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	err := mc.client.Database("common").Collection(USERS_COLLECTION).FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return domain.User{}, apperrors.ErrNotFound
	}
	return user, nil
}

func (mc *mongodbConn) DeleteUser(id primitive.ObjectID) error {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.client.Database("common").Collection(USERS_COLLECTION).DeleteOne(ctx, filter)
	return err
}

func (mc *mongodbConn) FetchAllUsers() ([]domain.User, error) {
	opts := options.Find().SetProjection(bson.M{"password": 0})
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var users []domain.User
	cursor, err := mc.client.Database("common").Collection(USERS_COLLECTION).Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &users); err != nil {
		return nil, apperrors.ErrInternal
	}
	if users == nil {
		return nil, apperrors.ErrNotFound
	}
	return users, nil
}

func (mc *mongodbConn) FetchUser(id primitive.ObjectID) (domain.User, error) {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	opts := options.FindOne().SetProjection(bson.M{"password": 0})
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var user domain.User
	err := mc.client.Database("common").Collection(USERS_COLLECTION).FindOne(ctx, filter, opts).Decode(&user)
	if err != nil {
		return domain.User{}, apperrors.ErrNotFound
	}
	return user, nil
}

func (mc *mongodbConn) PostEnclosure(email string, enclosureIds []string) error {
	filter := bson.M{"email": bson.M{"$eq": email}}
	update := bson.M{"$addToSet": bson.M{"enclosureIds": bson.M{"$each": enclosureIds}}}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.client.Database("common").Collection(USERS_COLLECTION).UpdateOne(ctx, filter, update)
	return err
}
