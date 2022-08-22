package agroslabrepo

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
		"$set": bson.M{
			"parcels": parcelRefs,
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
	var enclosureIds []string
	for _, x := range parcelRefs {
		parcelIds = append(parcelIds, x.Id)
		enclosureIds = append(enclosureIds, x.Enclosures.Ids...)
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
			"$unwind": "$current.enclosures",
		},
		{
			"$match": bson.M{
				"current.enclosures.id": bson.M{
					"$in": enclosureIds,
				},
			},
		},
		{
			"$group": bson.M{
				"_id": "$_id",
				"id": bson.M{
					"$first": "$id",
				},
				"ts": bson.M{
					"$first": "$ts",
				},
				"current": bson.M{
					"$first": "$current",
				},
				"enclosures": bson.M{
					"$push": "$current.enclosures",
				},
			},
		},
		{
			"$set": bson.M{
				"current.enclosures": "$enclosures",
			},
		},
		{
			"$project": bson.M{
				"enclosures": 0,
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

// [
//   {
//     "$match": {
//       "id": {
//         "$in": [
//           "45-137-0-0-9-23",
//           "45-137-0-0-9-20"
//         ]
//       }
//     }
//   },
//   {
//     "$unwind": "$current.enclosures"
//   },
//   {
//     "$match": {
//       "current.enclosures.id": {
//         "$in": [
//           "45-137-0-0-9-23-1",
//           "45-137-0-0-9-23-3",
//           "45-137-0-0-9-20-32"
//         ]
//       }
//     }
//   },
//   {
//     "$group": {
//       "_id": "$_id",
//       "id": {
//         "$first": "$id"
//       },
//       "ts": {
//         "$first": "$ts"
//       },
//       "current": {
//         "$first": "$current"
//       },
//       "enclosures": {
//         "$push": "$current.enclosures"
//       }
//     }
//   },
//   {
//     "$set": {
//       "current.enclosures": "$enclosures"
//     }
//   },
//   {
//     "$project": {
//       "enclosures": 0
//     }
//   },
//   {
//     "$sort": {
//       "id": 1
//     }
//   }
// ]
