package services

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"fmt"
	"time"
)

type digitalTwinsService struct {
	persistence ports.DigitalTwinsRepository
	workflows   ports.DigitalTwinsWorkflows
}

func NewDigitalTwinsService(persistence ports.DigitalTwinsRepository, workflows ports.DigitalTwinsWorkflows) *digitalTwinsService {
	return &digitalTwinsService{
		persistence: persistence,
		workflows:   workflows,
	}
}

func (srv *digitalTwinsService) CreateNewDigitalTwin(enclosure domain.DigitalTwin) error {
	// First create workflows namespace
	err := srv.workflows.CreateNewDigitalTwinNamespace(enclosure.Id)
	if err != nil {
		return err
	}
	// First get meteorological station
	idema, name, distance, err := srv.workflows.GetMeteorologicalStation(enclosure.Id)
	if err != nil {
		return err
	}
	// Add meteorological station to enclosure
	enclosure.Properties.MeteoStation = struct {
		Idema    string  "json:\"idema\""
		Name     string  "json:\"name\""
		Distance float32 "json:\"distance(km)\""
	}{Idema: idema, Name: name, Distance: distance}
	return srv.persistence.CreateNewDigitalTwin(enclosure)
}

func (srv *digitalTwinsService) GetDigitalTwins(digitalTwinIds []string, year int16) ([]domain.DigitalTwin, error) {
	return srv.persistence.GetDigitalTwins(digitalTwinIds, year)
}

func (srv *digitalTwinsService) GetDigitalTwinsInRadius(digitalTwinId string, radius float64, year int16) ([]domain.DigitalTwin, error) {
	enclosure, err := srv.persistence.GetDigitalTwins([]string{digitalTwinId}, year)
	if err != nil {
		return nil, err
	}
	return srv.persistence.GetDigitalTwinsInRadius(enclosure[0].Geometry.Coordinates[0][0], radius, year)
}

func (srv *digitalTwinsService) GetHistoricalWeather(idema string, startDate time.Time, endDate time.Time, fields []string) ([]domain.HistoricalWeather, error) {
	return srv.persistence.GetHistoricalWeather(idema, startDate, endDate, fields)
}

func (srv *digitalTwinsService) GetForecastWeather(digitalTwinId string) (domain.ForecastWeather, error) {
	return srv.workflows.GetForecastWeather(digitalTwinId)
}

func (srv *digitalTwinsService) GetDailyWeather(digitalTwinId string) (domain.DailyWeather, error) {
	return srv.workflows.GetDailyWeather(digitalTwinId)
}

func (srv *digitalTwinsService) GetNDVI(digitalTwinId string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error) {
	return srv.persistence.GetNDVI(digitalTwinId, startDate, endDate, limit)
}

func (srv *digitalTwinsService) GetActivities(digitalTwinId string, activityType string, startDate time.Time, endDate time.Time, Limit int) ([]domain.Activity, error) {
	return srv.persistence.GetActivities(digitalTwinId, activityType, startDate, endDate, Limit)
}

func (srv *digitalTwinsService) FetchAllDigitalTwinsIds() ([]string, error) {
	return srv.persistence.FetchAllDigitalTwinsIds()
}

func (srv *digitalTwinsService) SetNewActivities(digitalTwinId string, FileName string, fromBucket string) error {
	return srv.workflows.SetNewActivities(digitalTwinId, FileName, fromBucket)
}

func (srv *digitalTwinsService) SetNewYield(digitalTwinId string, FileName string, fromBucket string) error {
	return srv.workflows.SetNewYield(digitalTwinId, FileName, fromBucket)
}

func (srv *digitalTwinsService) GetPrediction(digitalTwin string, predictionType string, startDate time.Time, endDate time.Time) ([]domain.Prediction, error) {
	return srv.persistence.GetPrediction(digitalTwin, predictionType, startDate, endDate)
}

func (srv *digitalTwinsService) StartSimulation(digitalTwinId string, startDate time.Time, endDate time.Time, numTrees int) (string, error) {
	return srv.workflows.StartSimulation(digitalTwinId, startDate, endDate, numTrees)
}

func (srv *digitalTwinsService) GetSimulations(digitalTwinId string) ([]domain.Simulation, error) {
	return srv.persistence.GetSimulations(digitalTwinId)
}

func (srv *digitalTwinsService) ResumeSimulation(digitalTwinId string, simulationId string) error {
	return srv.workflows.ResumeSimulation(digitalTwinId, simulationId)
}

func (srv *digitalTwinsService) StopSimulation(digitalTwinId string, simulationId string) error {
	return srv.workflows.StopSimulation(digitalTwinId, simulationId)
}

func (srv *digitalTwinsService) SimulationSpeed(digitalTwinId string, simulationId string, speed float32) error {
	return srv.workflows.SimulationSpeed(digitalTwinId, simulationId, speed)
}

func (srv *digitalTwinsService) GetSensorData(digitalTwinId string, sensorType string, startDate time.Time, endDate time.Time) ([]domain.SensorData, error) {
	return srv.persistence.GetSensorData(digitalTwinId, sensorType, startDate, endDate)
}

func (srv *digitalTwinsService) DeleteSimulation(digitalTwinId string, simulationId string) error {
	err := srv.workflows.StopSimulation(digitalTwinId, simulationId)
	if err != nil {
		fmt.Println(err)
	}
	return srv.persistence.DeleteSimulation(digitalTwinId, simulationId)
}

func (srv *digitalTwinsService) HandleNotifications(digitalTwinId string, notificationType string, value interface{}) error {
	return srv.workflows.HandleNotifications(digitalTwinId, notificationType, value)
}

func (srv *digitalTwinsService) GetCommands(digitalTwinId string) ([]domain.Command, error) {
	return srv.persistence.GetCommands(digitalTwinId)
}
