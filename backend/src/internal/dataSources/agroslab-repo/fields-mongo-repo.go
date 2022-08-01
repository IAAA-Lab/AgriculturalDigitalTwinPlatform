package agroslabrepo

import (
	"context"
	"fmt"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/exp/slices"
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

func (mc *mongodbConn) GetParcelsRef(userId primitive.ObjectID) ([]domain.ParcelRefs, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	// Find parcels references of the user with [userId]
	var userParcelsRefs []domain.ParcelRefs
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"_id":     bson.M{"$eq": userId},
				"parcels": bson.M{"$exists": true},
			},
		},
		{
			"$unwind": "$parcels",
		},
		{
			"$project": bson.M{
				"parcels": 1,
				"_id":     0,
			},
		},
		{
			"$sort": bson.M{
				"id": 1,
			},
		},
		{
			"$replaceRoot": bson.M{
				"newRoot": "$parcels",
			},
		},
	}
	cursor, err := mc.db.Collection("User").Aggregate(ctx, pipeline)
	if err != nil {
		return []domain.ParcelRefs{}, apperrors.ErrNotFound
	}
	err = cursor.All(ctx, &userParcelsRefs)
	if err != nil {
		return []domain.ParcelRefs{}, apperrors.ErrNotFound
	}
	return userParcelsRefs, err
}

func (mc *mongodbConn) PostParcelsAndEnclosures(userId primitive.ObjectID, parcelRefs []domain.ParcelRefs) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{
		"_id": bson.M{"$eq": userId},
	}
	update := bson.M{
		"$addToSet": bson.M{
			"parcels": bson.M{
				"$each": parcelRefs,
			},
		},
	}
	_, err := mc.db.Collection("User").UpdateOne(ctx, filter, update)
	return err
}

func (mc *mongodbConn) GetParcels(parcelRefs []domain.ParcelRefs, anyo int) ([]domain.Parcel, error) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	// Get the parcels info of [userParcelRefs]
	var parcelIds []string
	for _, x := range parcelRefs {
		parcelIds = append(parcelIds, x.Id)
	}
	var userParcels []domain.Parcel
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"id": bson.M{
					"$in": parcelIds,
				},
			},
		},
		{
			"$sort": bson.M{
				"id": 1,
			},
		},
	}
	cursor, err := mc.db.Collection("Fields").Aggregate(ctx, pipeline)
	if err != nil {
		return []domain.Parcel{}, err
	}
	err = cursor.All(ctx, &userParcels)
	if err != nil {
		return []domain.Parcel{}, err
	}
	if len(userParcels) != len(parcelRefs) {
		return []domain.Parcel{}, apperrors.ErrNotFound
	}
	// Filter the enclosures "manually" because I don´t know how to make it
	// through an agreggate in mongodb xd
	for i, x := range userParcels {
		k := 0
		for _, y := range x.Current.Enclosures {
			fmt.Println(parcelRefs[i].Enclosures.Id, y.Id)
			if slices.Contains(parcelRefs[i].Enclosures.Id, y.Id) {
				userParcels[i].Current.Enclosures[k] = y
				k++
			}
		}
		// Remove element from slice
		userParcels[i].Current.Enclosures = userParcels[i].Current.Enclosures[:k]
	}

	return userParcels, err
}

func (mc *mongodbConn) PostParcel(parcel domain.Parcel) error {
	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	filter := bson.M{"id": bson.M{"$eq": parcel.Id}}
	update := bson.M{"$set": parcel}
	opts := options.Update().SetUpsert(true)
	_, err := mc.db.Collection("Fields").UpdateOne(ctx, filter, update, opts)
	return err
}
