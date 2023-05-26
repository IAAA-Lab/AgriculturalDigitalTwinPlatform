package services

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"sort"
	"time"
)

type enclosuresService struct {
	persistence ports.ParcelsRepository
	esb         ports.ParcelsESB
}

func NewEnclosuresService(persistence ports.ParcelsRepository, esb ports.ParcelsESB) *enclosuresService {
	return &enclosuresService{
		persistence: persistence,
		esb:         esb,
	}
}

func (srv *enclosuresService) GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error) {
	return srv.persistence.GetEnclosures(enclosureIds, year)
}

func (srv *enclosuresService) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	return srv.persistence.GetHistoricalWeather(idema, startDate, endDate)
}

func (srv *enclosuresService) GetForecastWeather(enclosureId string) (domain.ForecastWeather, error) {
	return srv.esb.GetForecastWeather(enclosureId)
}

func (srv *enclosuresService) GetDailyWeather(enclosureId string) (domain.DailyWeather, error) {
	return srv.esb.GetDailyWeather(enclosureId)
}

func (srv *enclosuresService) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error) {
	return srv.persistence.GetNDVI(enclosureIds, startDate, endDate, limit)
}

func (srv *enclosuresService) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	return srv.persistence.GetFertilizers(enclosureId, startDate, endDate)
}

func (srv *enclosuresService) GetTreatments(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Treatment, error) {
	treatments, err := srv.persistence.GetTreatments(enclosureId, startDate, endDate)
	if err != nil {
		return nil, err
	}
	sort.Slice(treatments, func(i, j int) bool {
		return treatments[i].Date.Before(treatments[j].Date)
	})
	return treatments, nil
}

func (srv *enclosuresService) GetFarmHolder(farmId domain.FarmHolderId) (domain.FarmHolder, error) {
	return srv.persistence.GetFarmHolder(farmId)
}
