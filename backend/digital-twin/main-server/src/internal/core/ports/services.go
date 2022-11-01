package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type NewsService interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id string) (domain.News, error)
	PostNewNews(news domain.News) error
	UpdateNews(id string, news domain.News) error
	DeleteNews(id string) error
}

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id string) (domain.User, error)
	DeleteUser(id string) error
	PostNewUser(user domain.User) error
}

type ParcelsService interface {
	// User parcels
	GetUserParcels(userId string) (domain.UserParcels, error)
	PostUserParcels(userParcels domain.UserParcels) error
	PatchUserEnclosures(userId string, enclosureIds []string) error
	GetSummary(userId string) (domain.Summary, error)
	// Weather
	GetForecastWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error)
	GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	// Parcels
	GetParcels(enclosureIds []string) ([]domain.Parcel, error)
	// NDVI
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error)
	//TODO: ask the esb for the NDVI Map provider
	// Farm
	GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error)
	// Fertilizers
	GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	// Phytosanitaries
	GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	// Crops
	GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
	// Sensors
	GetSensorData(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error)
	// Notifications
	GetNotifications(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error)
}

type JWTService interface {
	GenerateAccessToken(user domain.User) string
	GenerateRefreshToken(user domain.User) string
	ValidateToken(token string) (*jwt.Token, error)
	DeleteRefreshToken(userId string)
	GetRefreshToken(userId string) (string, error)
}

type EncryptionService interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheService interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}

type FileStorageService interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadFile(file []byte, path string) (string, error)
	DeleteFile(fileName string, path string) error
}
