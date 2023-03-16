package mongodb

import (
	"digital-twin/main-server/src/internal/core/domain"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) PostNewUser(user domain.User) error {
	return mc.InsertDocument(USERS_COLLECTION, user, nil)
}

func (mc *mongodbConn) FetchUserByEmail(email string) (domain.User, error) {
	filter := bson.M{"email": bson.M{"$eq": email}}
	user, err := GetDocument[domain.User](mc, USERS_COLLECTION, filter, nil)
	if err != nil {
		return domain.User{}, err
	}
	if err != nil {
		return domain.User{}, err
	}
	return user, err
}

func (mc *mongodbConn) DeleteUser(id primitive.ObjectID) error {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	return mc.DeleteDocument(USERS_COLLECTION, filter, nil)
}

func (mc *mongodbConn) FetchAllUsers() ([]domain.User, error) {
	opts := options.Find().SetProjection(bson.M{"password": 0})
	return GetDocuments[[]domain.User](mc, USERS_COLLECTION, bson.M{}, opts)
}

func (mc *mongodbConn) FetchUser(id primitive.ObjectID) (domain.User, error) {
	filter := bson.M{"_id": bson.M{"$eq": id}}
	opts := options.FindOne().SetProjection(bson.M{"password": 0})
	user, err := GetDocument[domain.User](mc, USERS_COLLECTION, filter, opts)
	if err != nil {
		return domain.User{}, err
	}
	//user := userRaw.(domain.User)
	return user, nil
}
