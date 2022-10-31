package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ---- Domain specific interfaces ----

type NewsRepository interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id primitive.ObjectID) (domain.News, error)
	PostNewNews(news domain.News) error
	UpdateNews(id primitive.ObjectID, news domain.News) error
	DeleteNews(id primitive.ObjectID) error
}

type UsersRepository interface {
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id primitive.ObjectID) (domain.User, error)
	FetchUserByEmail(email string) (domain.User, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type ParcelsRepository interface {
	// User parcels
	GetUserParcels(userId primitive.ObjectID) (domain.UserParcels, error)
	PostUserParcels(userParcels domain.UserParcels) error
	PostParcelsSummary(userId primitive.ObjectID, summary domain.Summary) error
	PatchUserEnclosures(userId primitive.ObjectID, enclosureIds []string) error
	// Weather
	GetForecastWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	PostForecastWeather(forecastWeather []domain.ForecastWeather) error
	GetDailyWeather(parcelId string, date time.Time) ([]domain.DailyWeather, error)
	GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	PostHistoricalWeather(historicalWeather []domain.HistoricalWeather) error
	// Parcels
	GetParcels(enclosureIds []string) ([]domain.Parcel, error)
	PostParcel(parcel domain.Parcel) error
	// NDVI
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error)
	PostNDVI(ndvi []domain.NDVI) error
	// Farm
	GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error)
	PostFarmHolder(farmHolder domain.FarmHolder) error
	// Fertilizers
	GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	PostFertilizers(fertilizer []domain.Fertilizer) error
	// Phytosanitaries
	GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	PostPhytosanitaries(phytosanitary []domain.Phytosanitary) error
	// Crops
	GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
	PostCropStats(cropStats []domain.CropStats) error
	// Sensors
	GetSensorData(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error)
	PostSensorData(sensorData []domain.SensorData) error
	// Notifications
	GetNotifications(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error)
	PostNotifications(notifications []domain.Notification) error
}

type ParcelsESB interface {
	// Parcels
	GetParcels(enclosureIds []string) ([]domain.Parcel, error)
	// Weather
	GetForecastWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	GetDailyWeather(municipality string, province string) ([]domain.DailyWeather, error)
	GetHistoricalWeather(parcelId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	// NDVI
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error)
	// Farm
	// TODO: get the hole farm, maybe asociated with the parcel
	// Fertilizers
	GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error)
	// Phytosanitaries
	GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error)
	// Crops
	GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error)
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

type FileStorageRepository interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadImage(image []byte, fileName string, path string) (string, error)
	DeleteFile(fileName string, path string) error
}
