package mongodb

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (mc *mongodbConn) CreateNewDigitalTwin(digitalTwin domain.DigitalTwin) error {
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	// Create a new database for the digital twin
	_, err := mc.client.Database(digitalTwin.Id).Collection("Properties").InsertOne(ctx, digitalTwin)
	if err != nil {
		return err
	}
	// First set geo index
	indexModel := mongo.IndexModel{
		Keys: bson.D{{"geometry", "2dsphere"}},
	}
	_, err = mc.client.Database("common").Collection(DIGITAL_TWINS_COLLECTION).Indexes().CreateOne(ctx, indexModel)
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Insert in common database
	_, err = mc.client.Database("common").Collection(DIGITAL_TWINS_COLLECTION).InsertOne(ctx, digitalTwin)
	fmt.Println(err)
	return err
}

func (mc *mongodbConn) GetDigitalTwins(digitalTwinIds []string, year int16) ([]domain.DigitalTwin, error) {
	// if year is zero, then we don't filter by year
	filter := bson.M{
		"id": bson.M{"$in": digitalTwinIds},
	}
	if year != 0 {
		filter["year"] = bson.M{"$eq": year}
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.DigitalTwin = []domain.DigitalTwin{}
	cursor, err := mc.client.Database("common").Collection(DIGITAL_TWINS_COLLECTION).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		fmt.Println(err)
		return nil, apperrors.ErrInternal
	}

	if results == nil {
		return nil, apperrors.ErrNotFound
	}
	return results, nil
}

func (mc *mongodbConn) GetForecastWeather(digitalTwinId string) (domain.ForecastWeather, error) {
	filter := bson.M{
		"digitalTwinId": bson.M{"$eq": digitalTwinId},
	}
	opts := options.FindOne().SetSort(bson.M{"date": -1})
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var result domain.ForecastWeather
	err := mc.client.Database(digitalTwinId).Collection(WEATHER_COLLECTION).FindOne(ctx, filter, opts).Decode(&result)
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	return result, nil
}

func (mc *mongodbConn) GetHistoricalWeather(digitalTwinId string, startDate time.Time, endDate time.Time, fields []string) ([]domain.HistoricalWeather, error) {
	filter := bson.M{
		"date": bson.M{"$gte": startDate, "$lte": endDate},
	}
	opts := options.Find().SetSort(bson.M{"date": -1})
	// If fields is empty, then we project all fields
	projection := bson.M{}
	if len(fields) > 0 {
		for _, field := range fields {
			projection[field] = 1
		}
		opts = opts.SetProjection(projection)
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.HistoricalWeather
	cursor, err := mc.client.Database(digitalTwinId).Collection(WEATHER_COLLECTION).Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) GetDigitalTwinsInRadius(coords []float64, radius float64, year int16) ([]domain.DigitalTwin, error) {
	// if year is zero, then we don't filter by year
	filter := bson.M{
		"geometry": bson.M{
			"$near": bson.M{
				"$geometry": bson.M{
					"type":        "Point",
					"coordinates": coords,
				},
				"$maxDistance": radius,
			},
		},
	}
	if year != 0 {
		filter["year"] = bson.M{"$eq": year}
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.DigitalTwin = []domain.DigitalTwin{}
	cursor, err := mc.client.Database("common").Collection(DIGITAL_TWINS_COLLECTION).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) GetNDVI(digitalTwinId string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error) {
	// if startDate or endDate are zero, then we don't filter by date
	pipeline := []bson.M{
		{
			"$match": bson.M{},
		},
		{
			"$sort": bson.M{
				"date": -1,
			},
		},
		{
			"$group": bson.M{
				"_id": bson.TypeNull,
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
				"_id": 0,
				"avg": 1,
				"ndvi": bson.M{
					"$slice": []interface{}{"$ndvi", limit},
				},
			},
		},
	}
	if !startDate.IsZero() && !endDate.IsZero() {
		pipeline[0]["$match"].(bson.M)["date"] = bson.M{"$gte": startDate, "$lte": endDate}
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.NDVI = []domain.NDVI{}
	cursor, err := mc.client.Database(digitalTwinId).Collection(NDVI_COLLECTION).Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) GetActivities(digitalTwinId string, activityType string, startDate time.Time, endDate time.Time, limit int) ([]domain.Activity, error) {
	pipeline := []bson.M{
		{
			"$match": bson.M{
				// "date":        bson.M{"$gte": startDate, "$lte": endDate},
			},
		},
		{
			"$sort": bson.M{
				"date": 1,
			},
		},
	}
	if !startDate.IsZero() && !endDate.IsZero() {
		pipeline[0]["$match"].(bson.M)["date"] = bson.M{"$gte": startDate, "$lte": endDate}
	}
	if activityType != "" {
		pipeline[0]["$match"].(bson.M)["activity"] = bson.M{"$eq": activityType}
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.Activity = []domain.Activity{}
	cursor, err := mc.client.Database(digitalTwinId).Collection(ACTIVITIES_COLLECTION).Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) FetchAllDigitalTwinsIds() ([]string, error) {
	res, err := mc.client.Database("common").Collection(DIGITAL_TWINS_COLLECTION).Distinct(context.Background(), "id", bson.M{})
	if err != nil {
		return nil, err
	}
	digitalTwinIds := make([]string, len(res))
	for i, id := range res {
		digitalTwinIds[i] = id.(string)
	}
	return digitalTwinIds, nil
}

func (mc *mongodbConn) GetPrediction(digitalTwin string, predictionType string, startDate time.Time, endDate time.Time) ([]domain.Prediction, error) {
	filter := bson.M{
		"date": bson.M{"$gte": startDate, "$lte": endDate},
		"type": bson.M{"$eq": predictionType},
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.Prediction
	cursor, err := mc.client.Database(digitalTwin).Collection(PREDICTIONS_COLLECTION).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) GetSensorData(digitalTwin string, sensorType string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	filter := bson.M{
		"timestamp": bson.M{"$gte": startDate, "$lte": endDate},
		"type":      bson.M{"$eq": sensorType},
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.SensorData
	cursor, err := mc.client.Database(digitalTwin).Collection(SENSOR_DATA_COLLECTION).Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) GetSimulations(digitalTwin string) ([]domain.Simulation, error) {
	filter := bson.M{}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.Simulation
	cursor, err := mc.client.Database(digitalTwin).Collection(SIMULATIONS_RESULTS_COLLECTION).Find(ctx, filter,
		options.Find().SetSort(bson.M{"timestamp": -1}).SetProjection(bson.M{"results": 0}))
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func (mc *mongodbConn) DeleteSimulation(digitalTwinId string, simulationId string) error {
	filter := bson.M{
		"simulationId": simulationId,
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	_, err := mc.client.Database(digitalTwinId).Collection(SIMULATIONS_COLLECTION).DeleteMany(ctx, filter)
	fmt.Println(err)
	_, err = mc.client.Database(digitalTwinId).Collection(SIMULATIONS_RESULTS_COLLECTION).DeleteOne(ctx, filter)
	return err
}

func (mc *mongodbConn) GetCommands(digitalTwinId string) ([]domain.Command, error) {
	pipeline := []bson.M{
		{
			"$limit": 10,
		},
		{
			"$sort": bson.M{
				"timestamp": -1,
			},
		},
	}
	var ctx, cancel = context.WithTimeout(context.Background(), time.Duration(mc.timeout)*time.Second)
	defer cancel()
	var results []domain.Command
	cursor, err := mc.client.Database(digitalTwinId).Collection(COMMANDS_COLLECTION).Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	if err = cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}
