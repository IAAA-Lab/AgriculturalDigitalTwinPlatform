package handlers

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/gin-gonic/gin"
)

type DigitalTwinsHTTPHandler struct {
	digitalTwinsService ports.DigitalTwinsService
	upgrader            websocket.Upgrader
}

func NewDigitalTwinsHTTPHandler(digitalTwinsService ports.DigitalTwinsService) *DigitalTwinsHTTPHandler {
	return &DigitalTwinsHTTPHandler{
		digitalTwinsService: digitalTwinsService,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
}

// -----------------------------------------------------------------------

// @Summary Create new digital twin
// @Description Create new digital twin
// @Tags Digital Twins
// @Accept  json
// @Produce  json
// @Param enclosure body domain.DigitalTwin true "Digital Twin"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures [post]
func (hdl *DigitalTwinsHTTPHandler) CreateNewDigitalTwin(c *gin.Context) {
	var enclosure domain.DigitalTwin
	err := c.ShouldBind(&enclosure)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	err = hdl.digitalTwinsService.CreateNewDigitalTwin(enclosure)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, "Digital Twin created successfully")
}

type EnclosuresIn struct {
	EnclosureIds []string `form:"enclosureIds" binding:"required"`
	Year         int16    `form:"year default=2022"`
}

// @Summary Get Enclosures
// @Description Get Enclosures
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureIds query string true "Enclosure Ids"
// @Param year query int true "Year"
// @Success 200 {object} []domain.Enclosure
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures [get]
func (hdl *DigitalTwinsHTTPHandler) GetDigitalTwins(c *gin.Context) {
	var enclosuresIn EnclosuresIn
	err := c.ShouldBind(&enclosuresIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.digitalTwinsService.GetDigitalTwins(enclosuresIn.EnclosureIds, enclosuresIn.Year)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, enclosures)
}

// -----------------------------------------------------------------------

type EnclosuresInRadiusIn struct {
	Radius float64 `form:"radius" binding:"required"`
	Year   int16   `form:"year default=2022"`
}

// @Summary Get Enclosures In Radius
// @Description Get Enclosures In Radius
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param radius query float64 true "Radius"
// @Param year query int true "Year"
// @Success 200 {object} []ports.Enclosure
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/radius [get]
func (hdl *DigitalTwinsHTTPHandler) GetDigitalTwinsInRadius(c *gin.Context) {
	enclosureId := c.Param("id")
	var enclosuresInRadiusIn EnclosuresInRadiusIn
	err := c.ShouldBind(&enclosuresInRadiusIn)
	fmt.Println(enclosuresInRadiusIn, enclosureId)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.digitalTwinsService.GetDigitalTwinsInRadius(enclosureId, enclosuresInRadiusIn.Radius, enclosuresInRadiusIn.Year)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, enclosures)
}

type CropStatsIn struct {
	EnclosureId string    `form:"enclosureId" binding:"required"`
	StartDate   time.Time `form:"startDate"`
	EndDate     time.Time `form:"endDate"`
}

type ActivitiesIn struct {
	DigitalTwinId string    `form:"digitalTwinId" binding:"required"`
	Type          string    `form:"type"`
	StartDate     time.Time `form:"startDate"`
	EndDate       time.Time `form:"endDate"`
	Limit         int       `form:"limit" default:"365"`
}

// @Summary Get Activities
// @Description Get Activities
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Enclosure Id"
// @Param date query string true "Date"
// @Success 200 {object} []ports.Treatment
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /activities [post]
func (hdl *DigitalTwinsHTTPHandler) GetActivities(c *gin.Context) {
	activitiesIn := ActivitiesIn{
		Limit: 365,
	}
	err := c.ShouldBind(&activitiesIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"digitalTwinId": "string, required", "startDate": "date, optional", "endDate": "date, optional", "limit": "int, optional", "type": "string, optional"}})
		return
	}
	activities, err := hdl.digitalTwinsService.GetActivities(activitiesIn.DigitalTwinId, activitiesIn.Type, activitiesIn.StartDate, activitiesIn.EndDate, activitiesIn.Limit)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, activities)
}

// -----------------------------------------------------------------------

type DailyWeatherIn struct {
	EnclosureId string `form:"enclosureId" binding:"required"`
}

// @Summary Get Daily Weather
// @Description Get Daily Weather
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Parcel Id"
// @Success 200 {object} []ports.DailyWeather
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /weather/daily [get]
func (hdl *DigitalTwinsHTTPHandler) GetDailyWeather(c *gin.Context) {
	var dailyWeatherIn DailyWeatherIn
	err := c.ShouldBind(&dailyWeatherIn)

	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"enclosureId": "string, required"}})
		return
	}
	dailyWeather, err := hdl.digitalTwinsService.GetDailyWeather(dailyWeatherIn.EnclosureId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, dailyWeather)
}

// -----------------------------------------------------------------------

type ForecastWeatherIn struct {
	EnclosureId string `form:"enclosureId" binding:"required"`
}

// @Summary Get Forecast Weather
// @Description Get Forecast Weather
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Parcel Id"
// @Success 200 {object} []ports.ForecastWeather
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /weather/forecast [get]
func (hdl *DigitalTwinsHTTPHandler) GetForecastWeather(c *gin.Context) {
	var forecastWeatherIn ForecastWeatherIn
	err := c.ShouldBind(&forecastWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	forecastWeather, err := hdl.digitalTwinsService.GetForecastWeather(forecastWeatherIn.EnclosureId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, forecastWeather)
}

// -----------------------------------------------------------------------

type HistoricalWeatherIn struct {
	Idema     string    `form:"idema" binding:"required"`
	StartDate time.Time `form:"startDate" binding:"required"`
	EndDate   time.Time `form:"endDate" binding:"required"`
	Fields    string    `form:"fields"`
}

// @Summary Get Historical Weather
// @Description Get Historical Weather
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param idema query string true "Idema"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Param fields query string false "Fields"
// @Success 200 {object} []ports.HistoricalWeather
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /weather/historical [get]
func (hdl *DigitalTwinsHTTPHandler) GetHistoricalWeather(c *gin.Context) {
	// Get Fields from query
	var historicalWeatherIn HistoricalWeatherIn
	err := c.ShouldBind(&historicalWeatherIn)
	// Extract fields from query, separated by comma
	fields := strings.Split(historicalWeatherIn.Fields, ",")
	if len(fields) == 1 && fields[0] == "" {
		fields = []string{}
	}
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"idema": "string, required", "startDate": "string, required", "endDate": "string, required"}})
		return
	}
	historicalWeather, err := hdl.digitalTwinsService.GetHistoricalWeather(historicalWeatherIn.Idema, historicalWeatherIn.StartDate, historicalWeatherIn.EndDate, fields)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, historicalWeather)
}

// -----------------------------------------------------------------------

type NDVIIn struct {
	Digital_twin_id string    `form:"digital_twin_id" binding:"required"`
	StartDate       time.Time `form:"startDate"`
	EndDate         time.Time `form:"endDate"`
	Limit           int       `form:"limit" default:"365"`
}

// @Summary Get NDVI
// @Description Get NDVI
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureIds query []string true "Enclosure Ids"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Success 200 {object} []ports.NDVI
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /ndvi [post]
func (hdl *DigitalTwinsHTTPHandler) GetNDVI(c *gin.Context) {
	ndviIn := NDVIIn{
		Limit: 365,
	}
	err := c.ShouldBind(&ndviIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"digital_twin_id": "string, required", "startDate": "time.Time, required", "endDate": "time.Time, required"}})
		return
	}
	ndvi, err := hdl.digitalTwinsService.GetNDVI(ndviIn.Digital_twin_id, ndviIn.StartDate, ndviIn.EndDate, ndviIn.Limit)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, ndvi)
}

// -----------------------------------------------------------------------

type PredictionIn struct {
	StartDate time.Time `form:"startDate"`
	EndDate   time.Time `form:"endDate"`
	Type      string    `form:"type"`
}

// @Summary Get Prediction
// @Description Get Prediction
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digital_twin_id query string true "Digital Twin Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Param type query string true "Type"
// @Success 200 {object} []ports.Prediction
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /prediction [get]

func (hdl *DigitalTwinsHTTPHandler) GetPrediction(c *gin.Context) {
	digitalTwinId := c.Param("id")
	predictionIn := PredictionIn{}
	err := c.ShouldBind(&predictionIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"startDate": "time.Time, required", "endDate": "time.Time, required", "type": "string, required"}})
		return
	}
	prediction, err := hdl.digitalTwinsService.GetPrediction(digitalTwinId, predictionIn.Type, predictionIn.StartDate, predictionIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, prediction)
}

// -----------------------------------------------------------------------

type SensorsIn struct {
	StartDate time.Time `form:"startDate"`
	EndDate   time.Time `form:"endDate"`
	Type      string    `form:"type"`
}

// @Summary Get Prediction
// @Description Get Prediction
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digital_twin_id query string true "Digital Twin Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Param type query string true "Type"
// @Success 200 {object} []ports.Prediction
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /prediction [get]

func (hdl *DigitalTwinsHTTPHandler) GetSensorData(c *gin.Context) {
	digitalTwinId := c.Param("id")
	predictionIn := PredictionIn{}
	err := c.ShouldBind(&predictionIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"startDate": "time.Time, required", "endDate": "time.Time, required", "type": "string, required"}})
		return
	}
	prediction, err := hdl.digitalTwinsService.GetSensorData(digitalTwinId, predictionIn.Type, predictionIn.StartDate, predictionIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, prediction)
}

// -----------------------------------------------------------------------

type SensorsStreamIn struct {
	Type string `form:"type"`
}

// @Summary Get Prediction
// @Description Get Prediction
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digital_twin_id query string true "Digital Twin Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Param type query string true "Type"
// @Success 200 {object} []ports.Prediction
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /prediction [get]

func (hdl *DigitalTwinsHTTPHandler) GetSensorStreamData(c *gin.Context) {
	digitalTwinId := c.Param("id")
	dataChan := make(chan any)
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer mongoClient.Disconnect(context.Background())
	collection := mongoClient.Database(digitalTwinId).Collection("Sensors")
	// options: only when "status" array changes
	options := options.ChangeStream()
	changeStream, err := collection.Watch(context.Background(), mongo.Pipeline{
		{{"$project", bson.M{"fullDocument._id": 0}}},
	}, options)
	if err != nil {
		fmt.Println(err)
		return
	}
	go func() {
		for changeStream.Next(context.Background()) {
			var data map[string]interface{}
			changeStream.Decode(&data)
			dataChan <- data["fullDocument"]
		}
	}()
	c.Stream(func(w io.Writer) bool {
		// Stream message to client from message channel
		msg := <-dataChan
		c.SSEvent("message", msg)
		return true
	})

}

// -----------------------------------------------------------------------

type StartSimulationIn struct {
	StartDate time.Time `form:"startDate"`
	EndDate   time.Time `form:"endDate"`
	NumTrees  int       `form:"numTrees"`
}

// @Summary Start Simulation
// @Description Start Simulation
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Param simulationId query string true "Simulation Id"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/:id/simulations/start [post]
func (hdl *DigitalTwinsHTTPHandler) StartSimulation(c *gin.Context) {
	digitalTwinId := c.Param("id")
	startSimulationIn := StartSimulationIn{}
	err := c.ShouldBind(&startSimulationIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"startDate": "time.Time, required", "maxTimeElapse": "time.Duration, required", "numTrees": "int, required"}})
		return
	}
	if startSimulationIn.NumTrees < 1 || startSimulationIn.StartDate.After(startSimulationIn.EndDate) {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	simulationId, err := hdl.digitalTwinsService.StartSimulation(digitalTwinId, startSimulationIn.StartDate, startSimulationIn.EndDate, startSimulationIn.NumTrees)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, struct {
		SimulationId string `json:"simulationId"`
	}{
		SimulationId: simulationId,
	})
}

// -----------------------------------------------------------------------

type StopSimulationIn struct {
	SimulationId string `form:"simulationId" binding:"required"`
}

// @Summary Stop Simulation
// @Description Stop Simulation
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Param simulationId query string true "Simulation Id"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/:id/simulations/stop [post]
func (hdl *DigitalTwinsHTTPHandler) StopSimulation(c *gin.Context) {
	digitalTwinId := c.Param("id")
	stopSimulationIn := StopSimulationIn{}
	err := c.ShouldBind(&stopSimulationIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"simulationId": "string, required"}})
		return
	}
	err = hdl.digitalTwinsService.StopSimulation(digitalTwinId, stopSimulationIn.SimulationId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, "Simulation stopped successfully")
}

// -----------------------------------------------------------------------

type SimulationSpeedIn struct {
	SimulationId string  `form:"simulationId" binding:"required"`
	Speed        float32 `form:"speed"`
}

// @Summary Simulation Speed
// @Description Simulation Speed
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Param simulationId query string true "Simulation Id"
// @Param speed query int true "Speed"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/:id/simulations/speed [post]
func (hdl *DigitalTwinsHTTPHandler) SimulationSpeed(c *gin.Context) {
	digitalTwinId := c.Param("id")
	simulationSpeedIn := SimulationSpeedIn{}
	err := c.ShouldBind(&simulationSpeedIn)
	fmt.Println(simulationSpeedIn)
	if err != nil {
		fmt.Println(err)
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"simulationId": "string, required", "speed": "float32, required"}})
		return
	}
	err = hdl.digitalTwinsService.SimulationSpeed(digitalTwinId, simulationSpeedIn.SimulationId, simulationSpeedIn.Speed)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, "Simulation speed changed successfully")
}

// -----------------------------------------------------------------------

type GetSimulationStatusIn struct {
	DigitalTwinId string `form:"digitalTwinId" binding:"required"`
	SimulationId  string `form:"simulationId" binding:"required"`
}

// @Summary Get Simulation Status
// @Description Get Simulation Status
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Param simulationId query string true "Simulation Id"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/simulations/status/ws [get]
func (hdl *DigitalTwinsHTTPHandler) GetSimulationStatus(c *gin.Context) {
	conn, err := hdl.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()
	for {
		// Get simulationId
		var simulationStatusIn GetSimulationStatusIn
		err := conn.ReadJSON(&simulationStatusIn)
		if err != nil {
			fmt.Println(err)
			return
		}
		mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
		if err != nil {
			fmt.Println(err)
			return
		}
		// Create a new goroutine to watch the simulation status
		go func() {
			defer mongoClient.Disconnect(context.Background())
			collection := mongoClient.Database(simulationStatusIn.DigitalTwinId).Collection("Simulations")
			// options: only when "status" array changes
			options := options.ChangeStream()
			changeStream, err := collection.Watch(context.Background(), mongo.Pipeline{
				{{"$match", bson.M{"fullDocument.simulationId": simulationStatusIn.SimulationId}}},
				{{"$project", bson.M{"fullDocument._id": 0}}},
			}, options)
			if err != nil {
				fmt.Println(err)
				return
			}
			for changeStream.Next(context.Background()) {
				var data map[string]interface{}
				changeStream.Decode(&data)
				conn.WriteJSON(struct {
					Type string      `json:"type"`
					Data interface{} `json:"data"`
				}{
					Type: "status",
					Data: data["fullDocument"],
				})
			}
		}()
		// Create a new goroutine to watch the simulation results
		go func() {
			// Mongodb watch collection
			defer mongoClient.Disconnect(context.Background())
			collection := mongoClient.Database(simulationStatusIn.DigitalTwinId).Collection("SimulationResults")
			// First send existing results
			time.Sleep(3 * time.Second)
			var simulation domain.Simulation
			err := collection.FindOne(context.Background(), bson.M{"simulationId": simulationStatusIn.SimulationId}).Decode(&simulation)
			if err != nil {
				return
			}
			fmt.Println(simulation)
			conn.WriteJSON(struct {
				Type string      `json:"type"`
				Data interface{} `json:"data"`
			}{
				Type: "results",
				Data: simulation.Results,
			})
			// options: only when "status" array changes

			options := options.ChangeStream().SetFullDocument(options.UpdateLookup)
			changeStream, err := collection.Watch(context.Background(), mongo.Pipeline{
				{{"$match", bson.M{"fullDocument.simulationId": simulationStatusIn.SimulationId}}},
			}, options)
			if err != nil {
				fmt.Println(err)
				return
			}
			for changeStream.Next(context.Background()) {
				var data map[string]interface{}
				changeStream.Decode(&data)
				fullDocument, ok := data["fullDocument"].(map[string]interface{})
				if !ok {
					return
				}
				conn.WriteJSON(struct {
					Type string      `json:"type"`
					Data interface{} `json:"data"`
				}{
					Type: "results",
					Data: fullDocument["results"],
				})
			}
		}()
	}
}

// -----------------------------------------------------------------------

// @Summary Get Simulations
// @Description Get Simulations
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/:id/simulations [get]
func (hdl *DigitalTwinsHTTPHandler) GetSimulations(c *gin.Context) {
	digitalTwinId := c.Param("id")
	simulations, err := hdl.digitalTwinsService.GetSimulations(digitalTwinId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, simulations)
}

// -----------------------------------------------------------------------

// @Summary Get Simulations
// @Description Get Simulations
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param digitalTwinId query string true "Digital Twin Id"
// @Success 200 {object} string
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures/:id/simulations [get]
func (hdl *DigitalTwinsHTTPHandler) DeleteSimulation(c *gin.Context) {
	digitalTwinId := c.Param("id")
	simulationId := c.Param("simulationId")
	err := hdl.digitalTwinsService.DeleteSimulation(digitalTwinId, simulationId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, "simulation deleted correctly")
}

// -----------------------------------------------------------------------
type GetNotificationsIn struct {
	DigitalTwinId string `form:"digitalTwinId" binding:"required"`
}

func (hdl *DigitalTwinsHTTPHandler) GetNotifications(c *gin.Context) {
	_ = c.Param("id")
	dataChan := make(chan any)
	mongoClient, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(os.Getenv("MONGO_URI")))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer mongoClient.Disconnect(context.Background())
	collection := mongoClient.Database("common").Collection("Notifications")
	// options: only when "status" array changes
	options := options.ChangeStream()
	changeStream, err := collection.Watch(context.Background(), bson.D{}, options)
	if err != nil {
		fmt.Println(err)
		return
	}
	go func() {
		for changeStream.Next(context.Background()) {
			var data map[string]interface{}
			changeStream.Decode(&data)
			dataChan <- data["fullDocument"]
		}
	}()
	c.Stream(func(w io.Writer) bool {
		// Stream message to client from message channel
		msg := <-dataChan
		c.SSEvent("message", msg)
		return true
	})
}
