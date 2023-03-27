package mongodb

import (
	"digital-twin/main-server/src/internal/core/domain"
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

func (mc *mongodbConn) PostParcelsSummary(userId primitive.ObjectID, summary domain.Summary) error {
	filter := bson.M{"userId": bson.M{"$eq": userId}}
	update := bson.M{"$set": bson.M{"summary": summary}}
	return mc.UpdateDocument(USER_PARCELS_COLLECTION, filter, update, nil)
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

func (mc *mongodbConn) PostForecastWeather(forecastWeather []domain.ForecastWeather) error {
	var fwIn []interface{}
	for _, fw := range forecastWeather {
		fwIn = append(fwIn, fw)
	}
	return mc.InsertDocuments(WEATHER_COLLECTION, fwIn, nil)
}

func (mc *mongodbConn) GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
		"date":     bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.HistoricalWeather](mc, WEATHER_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostHistoricalWeather(historicalWeather []domain.HistoricalWeather) error {
	var hwIn []interface{}
	for _, hw := range historicalWeather {
		hwIn = append(hwIn, hw)
	}
	return mc.InsertDocuments(WEATHER_COLLECTION, hwIn, nil)
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

func (mc *mongodbConn) PostDailyWeather(dailyWeather []domain.DailyWeather) error {
	var dwIn []interface{}
	for _, dw := range dailyWeather {
		dwIn = append(dwIn, dw)
	}
	return mc.InsertDocuments(WEATHER_COLLECTION, dwIn, nil)
}

func (mc *mongodbConn) GetParcels(enclosureIds []string) ([]domain.Parcel, error) {
	pipeline := []bson.M{
		{
			"$unwind": "$enclosures",
		},
		{
			"$match": bson.M{
				"enclosures.id": bson.M{
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
				"geometry": bson.M{
					"$first": "$geometry",
				},
				"properties": bson.M{
					"$first": "$properties",
				},
				"enclosures": bson.M{
					"$push": "$enclosures",
				},
			},
		},
		{
			"$set": bson.M{
				"enclosures": "$enclosures",
			},
		},
		{
			"$sort": bson.M{
				"id": 1,
			},
		},
	}
	parcelsIf, err := GetDocument[[]domain.Parcel](mc, PARCELS_COLLECTION, pipeline, nil)
	if err != nil {
		return nil, err
	}
	return parcelsIf, nil
}

func (mc *mongodbConn) PostParcel(parcel domain.Parcel) error {
	filter := bson.M{"id": bson.M{"$eq": parcel.Id}}
	update := bson.M{"$set": parcel}
	opts := options.Update().SetUpsert(true)
	return mc.UpdateDocument(PARCELS_COLLECTION, filter, update, opts)
}

func (mc *mongodbConn) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$in": enclosureIds},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.NDVI](mc, NDVI_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostNDVI(ndvi []domain.NDVI) error {
	var ndviIn []interface{}
	for _, nd := range ndvi {
		ndviIn = append(ndviIn, nd)
	}
	return mc.InsertDocuments(NDVI_COLLECTION, ndviIn, nil)
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

func (mc *mongodbConn) PostFarmHolder(farmHolder domain.FarmHolder) error {
	filter := bson.M{"id": bson.M{"$eq": farmHolder.Id}}
	update := bson.M{"$set": farmHolder}
	opts := options.Update().SetUpsert(true)
	return mc.UpdateDocument(FARM_COLLECTION, filter, update, opts)
}

func (mc *mongodbConn) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.Fertilizer](mc, FERTILIZERS_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostFertilizers(fertilizer []domain.Fertilizer) error {
	var fertilizerIn []interface{}
	for _, f := range fertilizer {
		fertilizerIn = append(fertilizerIn, f)
	}
	return mc.InsertDocuments(FERTILIZERS_COLLECTION, fertilizerIn, nil)
}

func (mc *mongodbConn) GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.Phytosanitary](mc, PHYTOSANITARIES_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostPhytosanitaries(phytosanitary []domain.Phytosanitary) error {
	var phytosanitaryIn []interface{}
	for _, p := range phytosanitary {
		phytosanitaryIn = append(phytosanitaryIn, p)
	}
	return mc.InsertDocuments(PHYTOSANITARIES_COLLECTION, phytosanitaryIn, nil)
}

func (mc *mongodbConn) GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.CropStats](mc, CROPSTATS_COLLECTION, filter, opts)

}

func (mc *mongodbConn) PostCropStats(cropStats []domain.CropStats) error {
	var cropStatsIn []interface{}
	for _, cs := range cropStats {
		cropStatsIn = append(cropStatsIn, cs)
	}
	return mc.InsertDocuments(CROPSTATS_COLLECTION, cropStatsIn, nil)
}

func (mc *mongodbConn) GetSensorData(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.SensorData](mc, SENSOR_DATA_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostSensorData(sensorData []domain.SensorData) error {
	var sensorDataIn []interface{}
	for _, sd := range sensorData {
		sensorDataIn = append(sensorDataIn, sd)
	}
	return mc.InsertDocuments(SENSOR_DATA_COLLECTION, sensorDataIn, nil)
}

func (mc *mongodbConn) GetNotifications(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	return GetDocuments[[]domain.Notification](mc, NOTIFICATIONS_COLLECTION, filter, opts)
}

func (mc *mongodbConn) PostNotifications(notifications []domain.Notification) error {
	var notificationsIn []interface{}
	for _, n := range notifications {
		notificationsIn = append(notificationsIn, n)
	}
	return mc.InsertDocuments(NOTIFICATIONS_COLLECTION, notificationsIn, nil)
}
