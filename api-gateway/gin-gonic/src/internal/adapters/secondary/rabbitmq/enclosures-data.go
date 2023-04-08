package rabbitmq

import (
	"digital-twin/main-server/src/internal/core/domain"
	"errors"
	"time"

	"github.com/goccy/go-json"
	"github.com/google/uuid"
)

type ForecastWeatherReq struct {
	EnclosureId string `json:"enclosureId"`
}

func (r *RabbitMQConn) GetForecastWeather(enclosureId string) (domain.ForecastWeather, error) {
	forecastWeatherRaw, err := r.ClientRPC("prefect", uuid.New().String(), domain.SyncEventExtSend{
		Payload: ForecastWeatherReq{
			EnclosureId: enclosureId,
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
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func (r *RabbitMQConn) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	historicalWeatherRaw, err := r.ClientRPC("prefect", uuid.New().String(), domain.SyncEventExtSend{
		Payload: HistoricalWeatherReq{
			Idema:     idema,
			StartDate: startDate,
			EndDate:   endDate,
		},
		Key: "historical_weather",
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
	EnclosureId string `json:"enclosureId"`
}

func (r *RabbitMQConn) GetDailyWeather(enclosureId string) (domain.DailyWeather, error) {
	dailyWeatherRaw, err := r.ClientRPC("prefect", uuid.New().String(), domain.SyncEventExtSend{
		Payload: DailyWeatherReq{EnclosureId: enclosureId},
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
