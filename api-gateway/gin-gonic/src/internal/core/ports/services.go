package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id string) (domain.User, error)
	FetchUserByEmail(email string) (domain.User, error)
	DeleteUser(id string) error
	PostNewUser(user domain.User) error
	PostEnclosure(email string, digitalTwinIds []string) error
}

type DigitalTwinsService interface {
	GetForecastWeather(digitalTwinId string) (domain.ForecastWeather, error)
	GetDailyWeather(digitalTwinId string) (domain.DailyWeather, error)
	GetHistoricalWeather(digitalTwinId string, startDate time.Time, endDate time.Time, fields []string) ([]domain.HistoricalWeather, error)
	CreateNewDigitalTwin(enclosure domain.DigitalTwin) error
	GetDigitalTwins(digitalTwinIds []string, year int16) ([]domain.DigitalTwin, error)
	GetDigitalTwinsInRadius(digitalTwinId string, radius float64, year int16) ([]domain.DigitalTwin, error)
	GetNDVI(digitalTwinId string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error)
	GetActivities(digitalTwinId string, activityType string, startDate time.Time, endDate time.Time, Limit int) ([]domain.Activity, error)
	FetchAllDigitalTwinsIds() ([]string, error)
	GetPrediction(digitalTwin string, predictionType string, startDate time.Time, endDate time.Time) ([]domain.Prediction, error)
	GetSensorData(digitalTwin string, sensorType string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error)
	SetNewActivities(digitalTwinId string, FileName string, fromBucket string) error
	SetNewYield(digitalTwinId string, FileName string, fromBucket string) error
	StartSimulation(digitalTwin string, startDate time.Time, endDate time.Time, numTrees int) (string, error)
	GetSimulations(digitalTwin string) ([]domain.Simulation, error)
	StopSimulation(digitalTwin string, simulationId string) error
	ResumeSimulation(digitalTwin string, simulationId string) error
	SimulationSpeed(digitalTwin string, simulationId string, speed float32) error
	DeleteSimulation(digitalTwin string, simulationId string) error
}

type JWTService interface {
	GenerateAccessToken(user domain.User) string
	GenerateRefreshToken(user domain.User) string
	ValidateToken(token string) (*jwt.Token, error)
	DeleteRefreshToken(userId string)
	GetRefreshToken(userId string) (string, error)
}

type APIKeyService interface {
	GenerateAPIKey() (string, error)
	ValidateAPIKey(key string) error
}

type StorageService interface {
	GetFile(fileName string, bucket string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, bucket string, path string, metadata map[string]string) error
}
