package parcelssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"log"
	"strings"
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

func (srv *service) GetSummary(userId string) (domain.Summary, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.Summary{}, apperrors.ErrInvalidInput
	}
	userParcels, err := srv.persistence.GetUserParcels(userIdObj)
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
	return srv.persistence.PostParcelsSummary(userIdObj, summary)
}

func (srv *service) PatchUserEnclosures(userId string, enclosureIds []string) error {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return apperrors.ErrInvalidInput
	}
	return srv.persistence.PatchUserEnclosures(userIdObj, enclosureIds)
}

func (srv *service) GetParcels(enclosureIds []string) ([]domain.Parcel, error) {
	parcels, err := srv.persistence.GetParcels(enclosureIds)
	if err == nil {
		return parcels, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	parcels, err = srv.esb.GetParcels(enclosureIds)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		//err := srv.persistence.PostParcel(parcels)
		if err != nil {
			log.Println(err)
		}
	}()
	return parcels, nil
}

func (srv *service) GetForecastWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.ForecastWeather, error) {
	forecastWeather, err := srv.persistence.GetForecastWeather(idema, startDate, endDate)
	if err == nil {
		return forecastWeather, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	forecastWeather, err = srv.esb.GetForecastWeather(idema, startDate, endDate)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostForecastWeather(forecastWeather)
		// TODO: use a proper logger
		if err != nil {
			log.Fatalln(err)
		}
	}()
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
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostHistoricalWeather(historicalWeather)
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return historicalWeather, nil
}

func (srv *service) GetDailyWeather(parcelId string, date time.Time) ([]domain.DailyWeather, error) {
	dailyWeather, err := srv.persistence.GetDailyWeather(parcelId, date)
	if err == nil {
		return dailyWeather, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	// Get province and municipality from parcelId
	cuttedParcelId := strings.Split(parcelId, "-")
	province := cuttedParcelId[0]
	municipality := cuttedParcelId[1]
	dailyWeather, err = srv.esb.GetDailyWeather(municipality, province)
	if err != nil {
		return nil, err
	}
	fmt.Println(dailyWeather)
	// No need to save in local database, because the historical weather is requested other way
	return dailyWeather, nil
}

func (srv *service) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	ndvi, err := srv.persistence.GetNDVI(enclosureIds, startDate, endDate)
	if err == nil {
		return ndvi, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	ndvi, err = srv.esb.GetNDVI(enclosureIds, startDate, endDate)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostNDVI(ndvi)
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return ndvi, nil
}

func (srv *service) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	fertilizers, err := srv.persistence.GetFertilizers(enclosureId, startDate, endDate)
	if err == nil {
		return fertilizers, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	fertilizers, err = srv.esb.GetFertilizers(enclosureId, startDate, endDate)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostFertilizers(fertilizers)
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return fertilizers, nil
}

func (srv *service) GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	phytosanitary, err := srv.persistence.GetPhytosanitaries(enclosureId, startDate, endDate)
	if err == nil {
		return phytosanitary, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	phytosanitary, err = srv.esb.GetPhytosanitaries(enclosureId, startDate, endDate)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostPhytosanitaries(phytosanitary)
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return phytosanitary, nil
}

func (srv *service) GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	cropStats, err := srv.persistence.GetCropStats(enclosureId, startDate, endDate)
	if err == nil {
		return cropStats, nil
	}
	if err != apperrors.ErrNotFound {
		return nil, err
	}
	// If not found in localdatabase, get from local ESB
	cropStats, err = srv.esb.GetCropStats(enclosureId, startDate, endDate)
	if err != nil {
		return nil, err
	}
	// Save in local database in background
	defer func() {
		err := srv.persistence.PostCropStats(cropStats)
		if err != nil {
			log.Fatalln(err)
		}
	}()
	return cropStats, nil
}

func (srv *service) GetFarmHolder(farmId domain.FarmHolderId) (domain.FarmHolder, error) {
	//TODO: Unimplemented
	return srv.persistence.GetFarmHolder(farmId)
}

func (srv *service) GetSensorData(enclousureId string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	// TODO: Unimplemented
	return nil, nil
}

func (srv *service) GetNotifications(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Notification, error) {
	//TODO: Unimplemented
	return nil, nil
}
