package temporal

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"fmt"
	"time"

	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/temporal"
)

func (r *temporalsrv) GetForecastWeather(enclosureId string) (domain.ForecastWeather, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "forecast-weather-" + enclosureId,
		TaskQueue: "weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		Enclosure_id string `json:"enclosure_id"`
	}

	input := Input{
		Enclosure_id: enclosureId,
	}
	var result domain.ForecastWeather
	workflowRun, err := r.client.ExecuteWorkflow(context.Background(), workflowOptions, "ForecastWeatherWorkflow", input)
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	err = workflowRun.Get(context.Background(), &result)
	fmt.Println("result ------ ")
	fmt.Println(result)
	return result, err
}

func (r *temporalsrv) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "historical-weather-" + idema,
		TaskQueue: "weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		Idema     string    `json:"idema"`
		StartDate time.Time `json:"start_date"`
		EndDate   time.Time `json:"end_date"`
	}

	input := Input{
		Idema:     idema,
		StartDate: startDate,
		EndDate:   endDate,
	}
	workflowRun, err := r.client.ExecuteWorkflow(context.Background(), workflowOptions, "HistoricalWeatherWorkflow", input)
	if err != nil {
		return nil, err
	}
	var result []domain.HistoricalWeather
	err = workflowRun.Get(context.Background(), &result)
	return result, err
}

func (r *temporalsrv) GetDailyWeather(enclosureId string) (domain.DailyWeather, error) {
	fmt.Println("GetDailyWeather --- ", enclosureId)
	workflowOptions := client.StartWorkflowOptions{
		ID:        "daily-weather-" + enclosureId,
		TaskQueue: "weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}

	type Input struct {
		Enclosure_id string `json:"enclosure_id"`
	}
	input := Input{
		Enclosure_id: enclosureId,
	}

	workflowRun, err := r.client.ExecuteWorkflow(context.Background(), workflowOptions, "DailyWeatherWorkflow", input)
	if err != nil {
		return domain.DailyWeather{}, err
	}
	var result domain.DailyWeather
	err = workflowRun.Get(context.Background(), &result)
	return result, err
}
