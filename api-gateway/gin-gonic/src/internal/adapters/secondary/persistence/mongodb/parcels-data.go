package mongodb

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) GetUserParcels(userId primitive.ObjectID) (domain.UserParcels, error) {
	filter := bson.M{"userId": bson.M{"$eq": userId}}
	userParcels, err := GetDocument[domain.UserParcels](mc, USER_PARCELS_COLLECTION, filter, nil)
	return userParcels, err
}

func (mc *mongodbConn) PostUserParcels(userParcels domain.UserParcels) error {
	filter := bson.M{"userId": bson.M{"$eq": userParcels.UserID}}
	update := bson.M{"$set": userParcels}
	opts := options.Update().SetUpsert(true)
	return mc.UpdateDocument(USER_PARCELS_COLLECTION, filter, update, opts)
}

func (mc *mongodbConn) PatchUserEnclosures(userId primitive.ObjectID, enclosureIds []string) error {
	filter := bson.M{"userId": bson.M{"$eq": userId}}
	update := bson.M{"$addToSet": bson.M{"enclosureIds": enclosureIds}}
	return mc.UpdateDocument(USER_PARCELS_COLLECTION, filter, update, nil)
}

func (mc *mongodbConn) GetForecastWeather(parcelId string) (domain.ForecastWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
	}
	opts := options.FindOne().SetSort(bson.M{"fint": -1})
	return GetDocument[domain.ForecastWeather](mc, WEATHER_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
		"date":     bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.HistoricalWeather](mc, WEATHER_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
		"date":     bson.M{"$eq": date},
	}
	opts := options.FindOne().SetSort(bson.M{"date": -1})
	dailyWeather, err := GetDocument[domain.DailyWeather](mc, WEATHER_COLLECTION, filter, opts)
	if err != nil {
		return domain.DailyWeather{}, err
	}
	return dailyWeather, nil
}

func (mc *mongodbConn) GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error) {
	fmt.Println(enclosureIds, year)
	// filter := bson.M{
	// 	"id": bson.M{
	// 		"$in": enclosureIds,
	// 	},
	// 	"year": bson.M{
	// 		"$eq": year,
	// 	},
	// }
	var result []domain.Enclosure
	cursor, err := mc.db.Collection(ENCLOSURES_COLLECTION).Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	if err = cursor.All(context.Background(), &result); err != nil {
		return nil, err
	}
	return result, nil
}

func (mc *mongodbConn) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$in": enclosureIds},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.NDVI](mc, NDVI_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error) {
	filter := bson.M{"id": bson.M{"$eq": id}}
	opts := options.FindOne()
	farmHolder, err := GetDocument[domain.FarmHolder](mc, FARM_COLLECTION, filter, opts)
	if err != nil {
		return domain.FarmHolder{}, err
	}
	return farmHolder, nil
}

func (mc *mongodbConn) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.Fertilizer](mc, FERTILIZERS_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.Phytosanitary](mc, PHYTOSANITARIES_COLLECTION, filter, opts)
}
