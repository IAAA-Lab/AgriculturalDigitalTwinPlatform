package parcelssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	persistence ports.ParcelsRepository
	esb         ports.ParcelsESB
}

func New(persistence ports.ParcelsRepository, esb ports.ParcelsESB) *service {
	return &service{
		persistence: persistence,
		esb:         esb,
	}
}

func (srv *service) GetUserParcels(userId string) (domain.UserParcels, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.UserParcels{}, apperrors.ErrInvalidInput
	}
	return srv.persistence.GetUserParcels(userIdObj)
}

func (srv *service) PostUserParcels(userParcels domain.UserParcels) error {
	return srv.persistence.PostUserParcels(userParcels)
}

func (srv *service) PatchUserEnclosures(userId string, enclosureIds []string) error {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return apperrors.ErrInvalidInput
	}
	return srv.persistence.PatchUserEnclosures(userIdObj, enclosureIds)
}

func (srv *service) GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error) {
	return srv.persistence.GetEnclosures(enclosureIds, year)
}

func (srv *service) GetForecastWeather(parcelId string) (domain.ForecastWeather, error) {
	//Get from local ESB
	forecastWeather, err := srv.esb.GetForecastWeather(parcelId)
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	return forecastWeather, nil
}

func (srv *service) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	historicalWeather, err := srv.persistence.GetHistoricalWeather(idema, startDate, endDate)
	if err == nil {
		return historicalWeather, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	historicalWeather, err = srv.esb.GetHistoricalWeather(idema, startDate, endDate)
	if err != nil {
		return nil, err
	}
	return historicalWeather, nil
}

func (srv *service) GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error) {
	// Get province and municipality from parcelId
	dailyWeather, err := srv.esb.GetDailyWeather(parcelId, date)
	if err != nil {
		return domain.DailyWeather{}, err
	}
	// No need to save in local database, because the historical weather is requested other way
	return dailyWeather, nil
}

func (srv *service) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	return srv.persistence.GetNDVI(enclosureIds, startDate, endDate)
}

func (srv *service) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	return srv.persistence.GetFertilizers(enclosureId, startDate, endDate)
}

func (srv *service) GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	return srv.persistence.GetPhytosanitaries(enclosureId, startDate, endDate)
}

func (srv *service) GetFarmHolder(farmId domain.FarmHolderId) (domain.FarmHolder, error) {
	return srv.persistence.GetFarmHolder(farmId)
}
