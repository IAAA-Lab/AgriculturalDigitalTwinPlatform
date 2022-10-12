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
	GetSummary(userId string) (domain.Summary, error)
	PostParcelsSummary(userId string, summary domain.Summary) error
	PatchUserEnclosures(userId string, enclosureIds []string) error
	// Weather
	GetForecastWeatherByIdema(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	GetForecastWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	PostForecastWeather(forecastWeather []domain.ForecastWeather) error
	GetDailyWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.DailyWeather, error)
	PostDailyWeather(dailyWeather []domain.DailyWeather) error
	// Parcels
	GetEnclosures(enclosureIds []string) ([]domain.Parcel, error)
	PostParcel(parcel domain.Parcel) error
	// NDVI
	GetNDVIByEnclosures(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error)
	PostNDVI(ndvi []domain.NDVI) error
	// Farm
	GetFarmHolderById(id domain.FarmHolderId) (domain.FarmHolder, error)
	PostFarmHolder(farmHolder domain.FarmHolder) error
	// Fertilizers
	GetFertilizersByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	GetFertilizersByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	GetFertilizersByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	PostFertilizers(fertilizer []domain.Fertilizer) error
	// Phytosanitaries
	GetPhytosanitariesByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	GetPhytosanitariesByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	GetPhytosanitariesByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	PostPhytosanitaries(phytosanitary []domain.Phytosanitary) error
	// Crops
	GetCropStatsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
	GetCropStatsByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
	GetCropStatsByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
	PostCropStats(cropStats []domain.CropStats) error
	// Sensors
	GetSensorDataByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error)
	PostSensorData(sensorData []domain.SensorData) error
	// Notifications
	GetNotificationsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error)
	PostNotifications(notifications []domain.Notification) error
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
