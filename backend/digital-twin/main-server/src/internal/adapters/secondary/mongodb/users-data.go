package mongodb

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

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
	err := mc.fetchUserByName(user.Username)
	if err == nil {
		return apperrors.ErrUserExists
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	encryptedPasswd, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return apperrors.ErrInternal
	}
	user.Password = string(encryptedPasswd)
	_, err = mc.db.Collection("User").InsertOne(ctx, user)
	if err != nil {
		return apperrors.ErrInternal
	}
	return nil
}

func (mc *mongodbConn) fetchUserByName(name string) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"username": bson.M{"$eq": name}}
	var user domain.User
	err := mc.db.Collection("User").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return apperrors.ErrNotFound
	}
	return nil
}

func (mc *mongodbConn) DeleteUser(id primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.db.Collection("User").DeleteOne(ctx, bson.M{"_id": id})
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
	for i := range results {
		results[i].Password = ""
	}
	return results, nil
}

func (mc *mongodbConn) FetchUser(id primitive.ObjectID) (domain.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"_id": bson.M{"$eq": id}}
	var user domain.User
	err := mc.db.Collection("User").FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return domain.User{}, apperrors.ErrNotFound
	}
	user.Password = ""
	return user, nil
}
