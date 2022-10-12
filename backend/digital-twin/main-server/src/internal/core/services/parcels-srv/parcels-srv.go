package parcelssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	parcelsRepository ports.ParcelsRepository
}

func New(parcelsRepository ports.ParcelsRepository) *service {
	return &service{
		parcelsRepository: parcelsRepository,
	}
}

func (srv *service) GetUserParcels(userId string) (domain.UserParcels, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.UserParcels{}, apperrors.ErrInvalidInput
	}
	return srv.parcelsRepository.GetUserParcels(userIdObj)
}

func (srv *service) PostUserParcels(userParcels domain.UserParcels) error {
	return srv.parcelsRepository.PostUserParcels(userParcels)
}

func (srv *service) GetSummary(userId string) (domain.Summary, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.Summary{}, apperrors.ErrInvalidInput
	}
	userParcels, err := srv.parcelsRepository.GetUserParcels(userIdObj)
	if err != nil {
		return domain.Summary{}, err
	}
	return userParcels.Summary, err
}

func (srv *service) PostParcelsSummary(userId string, summary domain.Summary) error {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return apperrors.ErrInvalidInput
	}
	return srv.parcelsRepository.PostParcelsSummary(userIdObj, summary)
}

func (srv *service) PatchUserEnclosures(userId string, enclosureIds []string) error {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return apperrors.ErrInvalidInput
	}
	return srv.parcelsRepository.PatchUserEnclosures(userIdObj, enclosureIds)
}

func (srv *service) GetForecastWeatherByIdema(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error) {
	return srv.parcelsRepository.GetForecastWeatherByIdema(idema, startDate, endDate)
}

func (srv *service) GetForecastWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error) {
	return srv.parcelsRepository.GetForecastWeatherByParcel(parcelId, startDate, endDate)
}

func (srv *service) PostForecastWeather(forecastWeather []domain.ForecastWeather) error {
	return srv.parcelsRepository.PostForecastWeather(forecastWeather)
}

func (srv *service) GetDailyWeatherByParcel(parcelId string, startDate time.Time, endDate time.Time) ([]domain.DailyWeather, error) {
	return srv.parcelsRepository.GetDailyWeatherByParcel(parcelId, startDate, endDate)
}

func (srv *service) PostDailyWeather(dailyWeather []domain.DailyWeather) error {
	return srv.parcelsRepository.PostDailyWeather(dailyWeather)
}

func (srv *service) GetEnclosures(enclosureIds []string) ([]domain.Parcel, error) {
	return srv.parcelsRepository.GetParcels(enclosureIds)
}

func (srv *service) PostParcel(parcel domain.Parcel) error {
	return srv.parcelsRepository.PostParcel(parcel)
}

func (srv *service) GetNDVIByEnclosures(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	return srv.parcelsRepository.GetNDVIByEnclosures(enclosureIds, startDate, endDate)
}

func (srv *service) PostNDVI(ndvi []domain.NDVI) error {
	return srv.parcelsRepository.PostNDVI(ndvi)
}

func (srv *service) GetFarmHolderById(id domain.FarmHolderId) (domain.FarmHolder, error) {
	return srv.parcelsRepository.GetFarmHolderById(id)
}

func (srv *service) PostFarmHolder(farmHolder domain.FarmHolder) error {
	return srv.parcelsRepository.PostFarmHolder(farmHolder)
}

func (srv *service) GetFertilizersByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	return srv.parcelsRepository.GetFertilizersByEnclosureId(enclosureId, startDate, endDate)
}

func (srv *service) GetFertilizersByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	return srv.parcelsRepository.GetFertilizersByCrop(cropId, startDate, endDate)
}

func (srv *service) GetFertilizersByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	return srv.parcelsRepository.GetFertilizersByEnclosureIdAndCrop(enclosureId, cropId, startDate, endDate)
}

func (srv *service) PostFertilizers(fertilizers []domain.Fertilizer) error {
	return srv.parcelsRepository.PostFertilizers(fertilizers)
}

func (srv *service) GetPhytosanitariesByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	return srv.parcelsRepository.GetPhytosanitariesByEnclosureId(enclosureId, startDate, endDate)
}

func (srv *service) GetPhytosanitariesByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	return srv.parcelsRepository.GetPhytosanitariesByCrop(cropId, startDate, endDate)
}

func (srv *service) GetPhytosanitariesByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	return srv.parcelsRepository.GetPhytosanitariesByEnclosureIdAndCrop(enclosureId, cropId, startDate, endDate)
}

func (srv *service) PostPhytosanitaries(phytosanitary []domain.Phytosanitary) error {
	return srv.parcelsRepository.PostPhytosanitaries(phytosanitary)
}

func (srv *service) GetCropStatsByEnclosureIdAndCrop(enclosureId string, cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	return srv.parcelsRepository.GetCropStatsByEnclosureIdAndCrop(enclosureId, cropId, startDate, endDate)
}

func (srv *service) GetCropStatsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	return srv.parcelsRepository.GetCropStatsByEnclosureId(enclosureId, startDate, endDate)
}

func (srv *service) GetCropStatsByCrop(cropId domain.CropId, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	return srv.parcelsRepository.GetCropStatsByCrop(cropId, startDate, endDate)
}

func (srv *service) PostCropStats(cropStats []domain.CropStats) error {
	return srv.parcelsRepository.PostCropStats(cropStats)
}

func (srv *service) GetSensorDataByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	return srv.parcelsRepository.GetSensorDataByEnclosureId(enclosureId, startDate, endDate)
}

func (srv *service) PostSensorData(sensorData []domain.SensorData) error {
	return srv.parcelsRepository.PostSensorData(sensorData)
}

func (srv *service) GetNotificationsByEnclosureId(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error) {
	return srv.parcelsRepository.GetNotificationsByEnclosureId(enclosureId, startDate, endDate)
}

func (srv *service) PostNotifications(notifications []domain.Notification) error {
	return srv.parcelsRepository.PostNotifications(notifications)
}
