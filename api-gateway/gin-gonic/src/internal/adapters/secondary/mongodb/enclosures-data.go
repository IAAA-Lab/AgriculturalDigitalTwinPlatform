package mongodb

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) GetForecastWeather(enclosureId string) (domain.ForecastWeather, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
	}
	opts := options.FindOne().SetSort(bson.M{"date": -1})
	return GetDocument[domain.ForecastWeather](mc, WEATHER_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	filter := bson.M{
		"idema": bson.M{"$eq": idema},
		"date":  bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[domain.HistoricalWeather](mc, WEATHER_COLLECTION, filter, opts)
}

func (mc *mongodbConn) GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error) {
	// if year is zero, then we don't filter by year
	filter := bson.M{
		"id": bson.M{"$in": enclosureIds},
	}
	if year != 0 {
		filter["year"] = bson.M{"$eq": year}
	}
	return GetDocuments[domain.Enclosure](mc, ENCLOSURES_COLLECTION, filter, nil)
}

func (mc *mongodbConn) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error) {
	// if startDate or endDate are zero, then we don't filter by date
	pipeline := []bson.M{
		{
			"$match": bson.M{
				"enclosureId": bson.M{"$in": enclosureIds},
				// "date":        bson.M{"$gte": startDate, "$lte": endDate},
			},
		},
		{
			"$sort": bson.M{
				"date": -1,
			},
		},
		{
			"$group": bson.M{
				"_id": "$enclosureId",
				"ndvi": bson.M{
					"$push": bson.M{
						"date":  "$date",
						"value": "$value",
					},
				},
				"avg": bson.M{
					"$avg": "$value",
				},
			},
		},
		{
			"$project": bson.M{
				"_id":         0,
				"enclosureId": "$_id",
				"avg":         1,
				"ndvi": bson.M{
					"$slice": []interface{}{"$ndvi", limit},
				},
			},
		},
	}
	if !startDate.IsZero() && !endDate.IsZero() {
		pipeline[0]["$match"].(bson.M)["date"] = bson.M{"$gte": startDate, "$lte": endDate}
	}
	return AggregateDocuments[domain.NDVI](mc, NDVI_COLLECTION, pipeline, nil)
}

func (mc *mongodbConn) GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error) {
	filter := bson.M{"id": bson.M{"$eq": id}}
	return GetDocument[domain.FarmHolder](mc, FARM_COLLECTION, filter, nil)
}

func (mc *mongodbConn) GetActivities(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Activity, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	return GetDocuments[domain.Activity](mc, ACTIVITIES_COLLECTION, filter, nil)
}

func (mc *mongodbConn) FetchAllEnclosureIds() ([]string, error) {
	res, err := mc.db.Collection(ENCLOSURES_COLLECTION).Distinct(context.Background(), "id", bson.M{})
	if err != nil {
		return nil, err
	}
	enclosureIds := make([]string, len(res))
	for i, id := range res {
		enclosureIds[i] = id.(string)
	}
	return enclosureIds, nil
}
