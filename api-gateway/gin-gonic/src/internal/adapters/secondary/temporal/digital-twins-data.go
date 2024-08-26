package temporal

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"fmt"
	"os"
	"time"

	"github.com/gofrs/uuid"
	"go.temporal.io/api/workflowservice/v1"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/temporal"
	"google.golang.org/protobuf/types/known/durationpb"
)

func (r *temporalConn) GetForecastWeather(digitalTwinId string) (domain.ForecastWeather, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "forecast-weather",
		TaskQueue: "forecast-weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		Enclosure_id string `json:"enclosure_id"`
	}

	input := Input{
		Enclosure_id: digitalTwinId,
	}
	var result domain.ForecastWeather
	workflowRun, err := r.GetClient("open-data").ExecuteWorkflow(context.Background(), workflowOptions, "ForecastWeatherWorkflow", input)
	if err != nil {
		return domain.ForecastWeather{}, err
	}
	err = workflowRun.Get(context.Background(), &result)
	return result, err
}

func (r *temporalConn) GetHistoricalWeather(digitalTwinId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "historical-weather",
		TaskQueue: "weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		DigitalTwinId string    `json:"digital_twin_id"`
		StartDate     time.Time `json:"start_date"`
		EndDate       time.Time `json:"end_date"`
	}

	input := Input{
		DigitalTwinId: digitalTwinId,
		StartDate:     startDate,
		EndDate:       endDate,
	}
	workflowRun, err := r.GetClient("open-data").ExecuteWorkflow(context.Background(), workflowOptions, "HistoricalWeatherWorkflow", input)
	if err != nil {
		return nil, err
	}
	var result []domain.HistoricalWeather
	err = workflowRun.Get(context.Background(), &result)
	return result, err
}

func (r *temporalConn) GetDailyWeather(digitalTwinId string) (domain.DailyWeather, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "daily-weather",
		TaskQueue: "daily-weather-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}

	type Input struct {
		Enclosure_id string `json:"enclosure_id"`
	}
	input := Input{
		Enclosure_id: digitalTwinId,
	}

	workflowRun, err := r.GetClient("open-data").ExecuteWorkflow(context.Background(), workflowOptions, "DailyWeatherWorkflow", input)
	if err != nil {
		return domain.DailyWeather{}, err
	}
	var result domain.DailyWeather
	err = workflowRun.Get(context.Background(), &result)
	return result, err
}

func (r *temporalConn) GetMeteorologicalStation(digitalTwinId string) (string, string, float32, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:        "meteo-station",
		TaskQueue: "static-info-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		Enclosure_id string `json:"enclosure_id"`
	}
	input := Input{
		Enclosure_id: digitalTwinId,
	}
	var result struct {
		Idema    string  `json:"idema"`
		Name     string  `json:"name"`
		Distance float32 `json:"distance"`
	}
	workflowRun, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "MeteoStationWorkflow", input)
	if err != nil {
		return "", "", 0, err
	}
	err = workflowRun.Get(context.Background(), &result)
	return result.Idema, result.Name, result.Distance, err
}

func (r *temporalConn) CreateNewDigitalTwinNamespace(digitalTwinId string) error {
	client, err := client.NewNamespaceClient(client.Options{
		HostPort: "temporal:7233",
	})
	if err != nil {
		return err
	}
	defer client.Close()
	err = client.Register(context.Background(), &workflowservice.RegisterNamespaceRequest{
		Namespace:                        digitalTwinId,
		WorkflowExecutionRetentionPeriod: durationpb.New(time.Duration(3 * time.Hour)),
	})
	if err.Error() == "Namespace already exists." {
		return nil
	}
	return err
}

func (r *temporalConn) SetNewActivities(digitalTwinId string, FileName string, fromBucket string) error {
	if fromBucket == os.Getenv("MINIO_LANDING_ZONE") {
		workflowOptions := client.StartWorkflowOptions{
			ID:        "activities-landing-" + digitalTwinId,
			TaskQueue: "activities-task-queue",
			RetryPolicy: &temporal.RetryPolicy{
				MaximumAttempts: 1,
			},
		}
		type Input struct {
			DigitalTwinId string `json:"digital_twin_id"`
			FileName      string `json:"file_name"`
		}
		input := Input{
			DigitalTwinId: digitalTwinId,
			FileName:      FileName,
		}
		_, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "ActivitiesTrustedWorkflow", input)
		if err != nil {
			return err
		}
	} else if fromBucket == os.Getenv("MINIO_TRUSTED_ZONE") {
		workflowOptions := client.StartWorkflowOptions{
			ID:        "activities-trusted-" + digitalTwinId,
			TaskQueue: "activities-task-queue",
			RetryPolicy: &temporal.RetryPolicy{
				MaximumAttempts: 1,
			},
		}
		type Input struct {
			DigitalTwinId string `json:"digital_twin_id"`
			FileName      string `json:"file_name"`
		}
		input := Input{
			DigitalTwinId: digitalTwinId,
			FileName:      FileName,
		}
		_, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "ActivitiesDTWorkflow", input)
		if err != nil {
			return err
		}
	} else if fromBucket == os.Getenv("MINIO_REFINED_ZONE") {
		// TODO: Implement the activities workflow
	} else {
		return fmt.Errorf("invalid bucket")
	}
	return nil
}

func (r *temporalConn) SetNewYield(digitalTwinId string, FileName string, fromBucket string) error {
	if fromBucket == os.Getenv("MINIO_LANDING_ZONE") {
		workflowOptions := client.StartWorkflowOptions{
			ID:        "yield-landing-" + digitalTwinId,
			TaskQueue: "activities-task-queue",
			RetryPolicy: &temporal.RetryPolicy{
				MaximumAttempts: 1,
			},
		}
		type Input struct {
			DigitalTwinId string `json:"digital_twin_id"`
			FileName      string `json:"file_name"`
		}
		input := Input{
			DigitalTwinId: digitalTwinId,
			FileName:      FileName,
		}
		_, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "YieldTrustedWorkflow", input)
		if err != nil {
			return err
		}
	} else if fromBucket == os.Getenv("MINIO_TRUSTED_ZONE") {
		workflowOptions := client.StartWorkflowOptions{
			ID:        "yield-trusted-" + digitalTwinId,
			TaskQueue: "activities-task-queue",
			RetryPolicy: &temporal.RetryPolicy{
				MaximumAttempts: 1,
			},
		}
		type Input struct {
			DigitalTwinId string `json:"digital_twin_id"`
			FileName      string `json:"file_name"`
		}
		input := Input{
			DigitalTwinId: digitalTwinId,
			FileName:      FileName,
		}
		_, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "YieldDTWorkflow", input)
		if err != nil {
			return err
		}
	} else if fromBucket == os.Getenv("MINIO_REFINED_ZONE") {
		// TODO: Implement the yield workflow
	} else {
		return fmt.Errorf("invalid bucket")
	}
	return nil
}

func (r *temporalConn) StartSimulation(digitalTwinId string, startDate time.Time, endDate time.Time, numTrees int) (string, error) {
	// UUID for new simulation
	simulationId := uuid.Must(uuid.NewV4()).String()
	workflowOptions := client.StartWorkflowOptions{
		ID:        "simulation_" + simulationId,
		TaskQueue: "harvest-simulation-task-queue",
		RetryPolicy: &temporal.RetryPolicy{
			MaximumAttempts: 1,
		},
	}
	type Input struct {
		DigitalTwinId string `json:"digital_twin_id"`
		StartDate     string `json:"start_date"`
		EndDate       string `json:"end_date"`
		NumTrees      int    `json:"num_trees"`
	}
	input := Input{
		DigitalTwinId: digitalTwinId,
		StartDate:     startDate.Format("2006-01-02"),
		EndDate:       endDate.Format("2006-01-02"),
		NumTrees:      numTrees,
	}
	_, err := r.GetClient(digitalTwinId).ExecuteWorkflow(context.Background(), workflowOptions, "HarvestAiSimulationWorkflow", input)
	if err != nil {
		return "", err
	}
	return simulationId, nil
}

func (r *temporalConn) ResumeSimulation(digitalTwinId string, simulationId string) error {
	return r.GetClient(digitalTwinId).SignalWorkflow(context.Background(), "simulation_"+simulationId, "", "resume", nil)
}

func (r *temporalConn) StopSimulation(digitalTwinId string, simulationId string) error {
	return r.GetClient(digitalTwinId).TerminateWorkflow(context.Background(), "simulation_"+simulationId, "", "stopped gracefully")
}

func (r *temporalConn) SimulationSpeed(digitalTwinId string, simulationId string, speed float32) error {
	err := r.GetClient(digitalTwinId).SignalWorkflow(context.Background(), "simulation_"+simulationId, "", "speed", speed)
	fmt.Println(err)
	return err
}
