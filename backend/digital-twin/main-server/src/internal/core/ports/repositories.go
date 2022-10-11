package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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
	GetForecastWeatherByIdema(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	GetForecastWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error)
	PostForecastWeather(forecastWeather []domain.ForecastWeather) error
	GetDailyWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.DailyWeather, error)
	PostDailyWeather(dailyWeather []domain.DailyWeather) error
	// Parcels
	GetParcels(enclosureIds []string) ([]domain.Parcel, error)
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

type EncryptionRepository interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}

type BusRepository interface {
	Publish(topic string, routingKey string, message []byte) error
	Subscribe(queueName string, exchangeName string, routingKey string, out chan<- amqp.Delivery)
}

type FileStorageRepository interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadImage(image []byte, fileName string, path string) (string, error)
	DeleteFile(fileName string, path string) error
}
