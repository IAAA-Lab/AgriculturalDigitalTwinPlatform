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
	PostEnclosure(email string, enclosureIds []string) error
}

type ParcelsRepository interface {
	GetHistoricalWeather(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error)
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error)
	GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error)
	GetActivities(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Activity, error)
	FetchAllEnclosureIds() ([]string, error)
}

type ParcelsESB interface {
	GetForecastWeather(enclosureId string) (domain.ForecastWeather, error)
	GetDailyWeather(enclosureId string) (domain.DailyWeather, error)
	GetHistoricalWeather(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
}

// ---- Adapter specific interfaces ----

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}

type StorageRepository interface {
	GetFile(fileName string, bucket string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, bucket string, path string) error
}
