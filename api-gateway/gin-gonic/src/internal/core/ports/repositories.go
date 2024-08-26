package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ---- Domain specific interfaces ----

type UsersRepository interface {
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id primitive.ObjectID) (domain.User, error)
	FetchUserByEmail(email string) (domain.User, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
	PostEnclosure(email string, digitalTwins []string) error
}

type DigitalTwinsRepository interface {
	GetHistoricalWeather(digitalTwin string, startDate time.Time, endDate time.Time, fields []string) ([]domain.HistoricalWeather, error)
	GetDigitalTwins(digitalTwins []string, year int16) ([]domain.DigitalTwin, error)
	CreateNewDigitalTwin(enclosure domain.DigitalTwin) error
	GetDigitalTwinsInRadius(coords []float64, radius float64, year int16) ([]domain.DigitalTwin, error)
	GetNDVI(digitalTwin string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error)
	GetActivities(digitalTwin string, activityType string, startDate time.Time, endDate time.Time, Limit int) ([]domain.Activity, error)
	FetchAllDigitalTwinsIds() ([]string, error)
	GetPrediction(digitalTwin string, predictionType string, startDate time.Time, endDate time.Time) ([]domain.Prediction, error)
	GetSensorData(digitalTwin string, sensorType string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error)
	GetSimulations(digitalTwin string) ([]domain.Simulation, error)
	DeleteSimulation(digitalTwin string, simulationId string) error
}

type DigitalTwinsWorkflows interface {
	GetForecastWeather(digitalTwin string) (domain.ForecastWeather, error)
	GetDailyWeather(digitalTwin string) (domain.DailyWeather, error)
	GetHistoricalWeather(digitalTwin string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	GetMeteorologicalStation(digitalTwin string) (string, string, float32, error)
	CreateNewDigitalTwinNamespace(digitalTwin string) error
	SetNewActivities(digitalTwinId string, FileName string, fromBucket string) error
	SetNewYield(digitalTwinId string, FileName string, fromBucket string) error
	StartSimulation(digitalTwin string, startDate time.Time, endDate time.Time, numTrees int) (string, error)
	StopSimulation(digitalTwin string, simulationId string) error
	ResumeSimulation(digitalTwin string, simulationId string) error
	SimulationSpeed(digitalTwin string, simulationId string, speed float32) error
}

// ---- Adapter specific interfaces ----

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}

type StorageRepository interface {
	GetFile(fileName string, bucket string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, bucket string, path string, metadata map[string]string) error
}
