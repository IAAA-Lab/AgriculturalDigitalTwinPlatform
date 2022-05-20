package usersrepo

import (
	"context"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
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

func (mc *mongodbConn) CheckLogin(username string, password []byte) (domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"username": bson.M{"$eq": username}}
	var user domain.User
	err := mc.db.Collection("User").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return domain.User{}, apperrors.ErrNotFound
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), password)
	if err != nil {
		return domain.User{}, apperrors.ErrLoginFailed
	}
	user.Password = ""
	return user, nil
}

func (mc *mongodbConn) PostNewUser(user domain.User) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.db.Collection("User").InsertOne(ctx, user)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (mc *mongodbConn) FetchAllUsers() ([]domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	cursor, err := mc.db.Collection("User").Find(ctx, bson.D{})
	if err != nil {
		return []domain.User{}, apperrors.ErrNotFound
	}
	var results []domain.User
	if err = cursor.All(context.TODO(), &results); err != nil {
		return []domain.User{}, apperrors.ErrInternal
	}
	return results, nil
}
