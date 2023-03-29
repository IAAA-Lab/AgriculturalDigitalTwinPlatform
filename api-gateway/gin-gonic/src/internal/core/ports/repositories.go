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
}

type ParcelsRepository interface {
	GetUserParcels(userId primitive.ObjectID) (domain.UserParcels, error)
	PostUserParcels(userParcels domain.UserParcels) error
	PatchUserEnclosures(userId primitive.ObjectID, enclosureIds []string) error
	GetForecastWeather(parcelId string) (domain.ForecastWeather, error)
	GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error)
	GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error)
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error)
	GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error)
	GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
}

type ParcelsESB interface {
	GetForecastWeather(parcelId string) (domain.ForecastWeather, error)
	GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error)
	GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
}

// ---- Adapter specific interfaces ----

type EncryptionRepository interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}

type LocalStorageRepository interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, path string) (string, error)
	DeleteFile(fileName string, path string) error
}

type StorageRepository interface {
	// GetFile(fileName string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, path string) error
}

type APIKeyRepository interface {
	GetAPIKey(key string) (string, error)
}
