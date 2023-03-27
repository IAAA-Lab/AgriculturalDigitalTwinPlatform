package rabbitmq

import (
	"digital-twin/main-server/src/internal/core/domain"
	"errors"
	"time"

	"github.com/goccy/go-json"
	"github.com/google/uuid"
)

func (r *RabbitMQConn) GetParcels(enclosureIds []string) ([]domain.Parcel, error) {
	// Wait for sync esb response
	parcelsRaw, err := r.ClientRPC("parcels.get", uuid.New().String(), domain.SyncEventExtSend{
		Payload: enclosureIds,
	})
	// Check if errors
	if err != nil {
		return nil, err
	}
	if parcelsRaw.ErrorMessage != "" {
		return nil, errors.New(parcelsRaw.ErrorMessage)
	}
	// Parse response to core domain
	var parcels []domain.Parcel
	err = json.Unmarshal(parcelsRaw.Payload, &parcels)
	if err != nil {
		return nil, err
	}
	return parcels, nil
}

type ForecastWeatherReq struct {
	ParcelId string `json:"parcelId"`
}

func (r *RabbitMQConn) GetForecastWeather(parcelId string) (domain.ForecastWeather, error) {
	forecastWeatherRaw, err := r.ClientRPC("prefect", uuid.New().String(), domain.SyncEventExtSend{
		Payload: ForecastWeatherReq{
			ParcelId: parcelId,
		},
		Key: "forecast_weather",
	})
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	if forecastWeatherRaw.ErrorMessage != "" {
		return domain.ForecastWeather{}, errors.New(forecastWeatherRaw.ErrorMessage)
	}
	var forecastWeather domain.ForecastWeather
	err = json.Unmarshal(forecastWeatherRaw.Payload, &forecastWeather)
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	return forecastWeather, nil
}

type HistoricalWeatherReq struct {
	Idema     string    `json:"idema"`
	StartDate time.Time `json:"start"`
	EndDate   time.Time `json:"end"`
}

func (r *RabbitMQConn) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	historicalWeatherRaw, err := r.ClientRPC("historical-weather.get", uuid.New().String(), domain.SyncEventExtSend{
		Payload: HistoricalWeatherReq{
			Idema:     idema,
			StartDate: startDate,
			EndDate:   endDate,
		},
	})
	if err != nil {
		return nil, err
	}
	if historicalWeatherRaw.ErrorMessage != "" {
		return nil, errors.New(historicalWeatherRaw.ErrorMessage)
	}
	var historicalWeather []domain.HistoricalWeather
	err = json.Unmarshal(historicalWeatherRaw.Payload, &historicalWeather)
	if err != nil {
		return nil, err
	}
	return historicalWeather, nil
}

type DailyWeatherReq struct {
	ParcelId string `json:"parcelId"`
}

func (r *RabbitMQConn) GetDailyWeather(parcelId string, date time.Time) (domain.DailyWeather, error) {
	dailyWeatherRaw, err := r.ClientRPC("prefect", uuid.New().String(), domain.SyncEventExtSend{
		Payload: DailyWeatherReq{ParcelId: parcelId},
		Key:     "daily_weather",
	})
	if err != nil {
		return domain.DailyWeather{}, err
	}
	if dailyWeatherRaw.ErrorMessage != "" {
		return domain.DailyWeather{}, errors.New(dailyWeatherRaw.ErrorMessage)
	}
	var dailyWeather domain.DailyWeather
	err = json.Unmarshal(dailyWeatherRaw.Payload, &dailyWeather)
	if err != nil {
		return domain.DailyWeather{}, err
	}
	return dailyWeather, nil
}

type NDVIReq struct {
	EnclosureIds []string  `json:"enclosureIds"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
}

func (r *RabbitMQConn) GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time) ([]domain.NDVI, error) {
	ndviRaw, err := r.ClientRPC("ndvi", uuid.New().String(), domain.SyncEventExtSend{
		Payload: NDVIReq{
			EnclosureIds: enclosureIds,
			StartDate:    startDate,
			EndDate:      endDate,
		},
	})
	if err != nil {
		return nil, err
	}
	if ndviRaw.ErrorMessage != "" {
		return nil, errors.New(ndviRaw.ErrorMessage)
	}
	var ndvi []domain.NDVI
	err = json.Unmarshal(ndviRaw.Payload, &ndvi)
	if err != nil {
		return nil, err
	}
	return ndvi, nil
}

type FertilizersReq struct {
	EnclosureId string    `json:"enclosureId"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
}

func (r *RabbitMQConn) GetFertilizers(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Fertilizer, error) {
	fertilizersRaw, err := r.ClientRPC("fertilizers.get", uuid.New().String(), domain.SyncEventExtSend{
		Payload: FertilizersReq{
			EnclosureId: enclosureId,
			StartDate:   startDate,
			EndDate:     endDate,
		},
	})
	if err != nil {
		return nil, err
	}
	if fertilizersRaw.ErrorMessage != "" {
		return nil, errors.New(fertilizersRaw.ErrorMessage)
	}
	var fertilizers []domain.Fertilizer
	err = json.Unmarshal(fertilizersRaw.Payload, &fertilizers)
	if err != nil {
		return nil, err
	}
	return fertilizers, nil
}

type PhytosanitariesReq struct {
	EnclosureId string    `json:"enclosureId"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
}

func (r *RabbitMQConn) GetPhytosanitaries(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Phytosanitary, error) {
	phytosanitariesRaw, err := r.ClientRPC("phytosanitaries.get", uuid.New().String(), domain.SyncEventExtSend{
		Payload: PhytosanitariesReq{
			EnclosureId: enclosureId,
			StartDate:   startDate,
			EndDate:     endDate,
		},
	})
	if err != nil {
		return nil, err
	}
	if phytosanitariesRaw.ErrorMessage != "" {
		return nil, errors.New(phytosanitariesRaw.ErrorMessage)
	}
	var phytosanitaries []domain.Phytosanitary
	err = json.Unmarshal(phytosanitariesRaw.Payload, &phytosanitaries)
	if err != nil {
		return nil, err
	}
	return phytosanitaries, nil
}

type CropStatsReq struct {
	EnclosureId string    `json:"enclosureId"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
}

func (r *RabbitMQConn) GetCropStats(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.CropStats, error) {
	cropStatsRaw, err := r.ClientRPC("crop-stats.get", uuid.New().String(), domain.SyncEventExtSend{
		Payload: CropStatsReq{
			EnclosureId: enclosureId,
			StartDate:   startDate,
			EndDate:     endDate,
		},
	})
	if err != nil {
		return nil, err
	}
	if cropStatsRaw.ErrorMessage != "" {
		return nil, errors.New(cropStatsRaw.ErrorMessage)
	}
	var cropStats []domain.CropStats
	err = json.Unmarshal(cropStatsRaw.Payload, &cropStats)
	if err != nil {
		return nil, err
	}
	return cropStats, nil
}
