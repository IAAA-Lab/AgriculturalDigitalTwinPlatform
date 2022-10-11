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
	userParcels, err := mc.GetDocument(USER_PARCELS_COLLECTION, filter, nil)
	return userParcels.(domain.UserParcels), err
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

func (mc *mongodbConn) GetForecastWeatherByIdema(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error) {
	filter := bson.M{
		"idema": bson.M{"$eq": idema},
		"fint":  bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"fint": -1}).SetLimit(1)
	forecast, err := mc.GetDocuments(WEATHER_COLLECTION, filter, opts)
	return forecast.([]domain.ForecastWeather), err
}

func (mc *mongodbConn) GetForecastWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
		"fint":     bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"fint": -1}).SetLimit(1)
	forecast, err := mc.GetDocuments(WEATHER_COLLECTION, filter, opts)
	return forecast.([]domain.ForecastWeather), err
}

func (mc *mongodbConn) PostForecastWeather(forecastWeather []domain.ForecastWeather) error {
	var fwIn []interface{}
	for _, fw := range forecastWeather {
		fwIn = append(fwIn, fw)
	}
	return mc.InsertDocuments(WEATHER_COLLECTION, fwIn, nil)
}

func (mc *mongodbConn) GetDailyWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.DailyWeather, error) {
	filter := bson.M{
		"parcelId": bson.M{"$eq": parcelId},
		"date":     bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	dailyWeather, err := mc.GetDocuments(WEATHER_COLLECTION, filter, opts)
	return dailyWeather.([]domain.DailyWeather), err
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
	parcelsIf, err := mc.GetDocument(PARCELS_COLLECTION, pipeline, nil)
	return parcelsIf.([]domain.Parcel), err

}

func (mc *mongodbConn) PostParcel(parcel domain.Parcel) error {
	filter := bson.M{"id": bson.M{"$eq": parcel.Id}}
	update := bson.M{"$set": parcel}
	opts := options.Update().SetUpsert(true)
	return mc.UpdateDocument(PARCELS_COLLECTION, filter, update, opts)
}

func (mc *mongodbConn) GetNDVIByEnclosures(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$in": enclosureIds},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	ndvi, err := mc.GetDocuments(NDVI_COLLECTION, filter, opts)
	return ndvi.([]domain.NDVI), err
}

func (mc *mongodbConn) PostNDVI(ndvi []domain.NDVI) error {
	var ndviIn []interface{}
	for _, nd := range ndvi {
		ndviIn = append(ndviIn, nd)
	}
	return mc.InsertDocuments(NDVI_COLLECTION, ndviIn, nil)
}

func (mc *mongodbConn) GetFarmHolderById(id domain.FarmHolderId) (domain.FarmHolder, error) {
	filter := bson.M{"id": bson.M{"$eq": id}}
	opts := options.FindOne()
	farmHolder, err := mc.GetDocument(FARM_COLLECTION, filter, opts)
	return farmHolder.(domain.FarmHolder), err
}

func (mc *mongodbConn) PostFarmHolder(farmHolder domain.FarmHolder) error {
	filter := bson.M{"id": bson.M{"$eq": farmHolder.Id}}
	update := bson.M{"$set": farmHolder}
	opts := options.Update().SetUpsert(true)
	return mc.UpdateDocument(FARM_COLLECTION, filter, update, opts)
}

func (mc *mongodbConn) GetFertilizersByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	fertilizers, err := mc.GetDocuments(FERTILIZERS_COLLECTION, filter, opts)
	return fertilizers.([]domain.Fertilizer), err
}

func (mc *mongodbConn) GetFertilizersByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	filter := bson.M{
		"cropId": bson.M{"$eq": cropId},
		"date":   bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	fertilizers, err := mc.GetDocuments(FERTILIZERS_COLLECTION, filter, opts)
	return fertilizers.([]domain.Fertilizer), err
}

func (mc *mongodbConn) GetFertilizersByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"cropId":      bson.M{"$eq": cropId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	fertilizers, err := mc.GetDocuments(FERTILIZERS_COLLECTION, filter, opts)
	return fertilizers.([]domain.Fertilizer), err
}

func (mc *mongodbConn) PostFertilizers(fertilizer []domain.Fertilizer) error {
	var fertilizerIn []interface{}
	for _, f := range fertilizer {
		fertilizerIn = append(fertilizerIn, f)
	}
	return mc.InsertDocuments(FERTILIZERS_COLLECTION, fertilizerIn, nil)
}

func (mc *mongodbConn) GetPhytosanitariesByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	phytosanitaries, err := mc.GetDocuments(PHYTOSANITARIES_COLLECTION, filter, opts)
	return phytosanitaries.([]domain.Phytosanitary), err
}

func (mc *mongodbConn) GetPhytosanitariesByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	filter := bson.M{
		"cropId": bson.M{"$eq": cropId},
		"date":   bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	phytosanitaries, err := mc.GetDocuments(PHYTOSANITARIES_COLLECTION, filter, opts)
	return phytosanitaries.([]domain.Phytosanitary), err
}

func (mc *mongodbConn) GetPhytosanitariesByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"cropId":      bson.M{"$eq": cropId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	phytosanitaries, err := mc.GetDocuments(PHYTOSANITARIES_COLLECTION, filter, opts)
	return phytosanitaries.([]domain.Phytosanitary), err
}

func (mc *mongodbConn) PostPhytosanitaries(phytosanitary []domain.Phytosanitary) error {
	var phytosanitaryIn []interface{}
	for _, p := range phytosanitary {
		phytosanitaryIn = append(phytosanitaryIn, p)
	}
	return mc.InsertDocuments(PHYTOSANITARIES_COLLECTION, phytosanitaryIn, nil)
}

func (mc *mongodbConn) GetCropStatsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	cropStats, err := mc.GetDocuments(CROPSTATS_COLLECTION, filter, opts)
	return cropStats.([]domain.CropStats), err
}

func (mc *mongodbConn) GetCropStatsByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	filter := bson.M{
		"cropId": bson.M{"$eq": cropId},
		"date":   bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	cropStats, err := mc.GetDocuments(CROPSTATS_COLLECTION, filter, opts)
	return cropStats.([]domain.CropStats), err
}

func (mc *mongodbConn) GetCropStatsByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"cropId":      bson.M{"$eq": cropId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	cropStats, err := mc.GetDocuments(CROPSTATS_COLLECTION, filter, opts)
	return cropStats.([]domain.CropStats), err
}

func (mc *mongodbConn) PostCropStats(cropStats []domain.CropStats) error {
	var cropStatsIn []interface{}
	for _, cs := range cropStats {
		cropStatsIn = append(cropStatsIn, cs)
	}
	return mc.InsertDocuments(CROPSTATS_COLLECTION, cropStatsIn, nil)
}

func (mc *mongodbConn) GetSensorDataByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	sensorData, err := mc.GetDocuments(SENSOR_DATA_COLLECTION, filter, opts)
	return sensorData.([]domain.SensorData), err
}

func (mc *mongodbConn) PostSensorData(sensorData []domain.SensorData) error {
	var sensorDataIn []interface{}
	for _, sd := range sensorData {
		sensorDataIn = append(sensorDataIn, sd)
	}
	return mc.InsertDocuments(SENSOR_DATA_COLLECTION, sensorDataIn, nil)
}

func (mc *mongodbConn) GetNotificationsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error) {
	filter := bson.M{
		"enclosureId": bson.M{"$eq": enclosureId},
		"date":        bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	notifications, err := mc.GetDocuments(NOTIFICATIONS_COLLECTION, filter, opts)
	return notifications.([]domain.Notification), err
}

func (mc *mongodbConn) PostNotifications(notifications []domain.Notification) error {
	var notificationsIn []interface{}
	for _, n := range notifications {
		notificationsIn = append(notificationsIn, n)
	}
	return mc.InsertDocuments(NOTIFICATIONS_COLLECTION, notificationsIn, nil)
}
