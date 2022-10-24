package parcelshdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"io"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type HTTPHandler struct {
	parcelsService ports.ParcelsService
}

type HTTPStreamHandler struct {
	parcelsService        ports.ParcelsService
	eventHandlerChannelIn chan<- domain.EventIn
}

func NewHTTPHandler(parcelService ports.ParcelsService) *HTTPHandler {
	return &HTTPHandler{
		parcelsService: parcelService,
	}
}

func NewHTTPStreamHandler(parcelService ports.ParcelsService, eventChannelIn chan<- domain.EventIn) *HTTPStreamHandler {
	return &HTTPStreamHandler{
		parcelsService:        parcelService,
		eventHandlerChannelIn: eventChannelIn,
	}
}

// -----------------------------------------------------------------------

type PostParcelRefsIn struct {
	UserId       string   `json:"userId"`
	EnclosureIds []string `json:"enclosureIds"`
}

func (hdl *HTTPHandler) PostParcelRefs(c *gin.Context) {
	var parcelRefsIn PostParcelRefsIn
	err := c.BindJSON(&parcelRefsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	err = hdl.parcelsService.PatchUserEnclosures(parcelRefsIn.UserId, parcelRefsIn.EnclosureIds)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(204, err)
}

// -----------------------------------------------------------------------

type ParcelRefsIn struct {
	UserId string `json:"userId"`
}

func (hdl *HTTPHandler) GetUserParcels(c *gin.Context) {
	var parcelRefsIn ParcelRefsIn
	err := c.BindJSON(&parcelRefsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	userParcels, err := hdl.parcelsService.GetUserParcels(parcelRefsIn.UserId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, userParcels)
}

// -----------------------------------------------------------------------

type EnclosuresIn struct {
	EnclosureIds []string `json:"enclosureIds"`
}

func (hdl *HTTPHandler) GetEnclosures(c *gin.Context) {
	var enclosuresIn EnclosuresIn
	err := c.BindJSON(&enclosuresIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.parcelsService.GetEnclosures(enclosuresIn.EnclosureIds)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, enclosures)
}

// -----------------------------------------------------------------------

type ParcelsSummary struct {
	UserId string `json:"userId"`
}

func (hdl *HTTPHandler) GetParcelsSummary(c *gin.Context) {
	var parcelsSummary ParcelsSummary
	err := c.BindJSON(&parcelsSummary)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	summary, err := hdl.parcelsService.GetSummary(parcelsSummary.UserId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, summary)
}

// -----------------------------------------------------------------------

type CropStatsIn struct {
	EnclosureId string        `json:"enclosureId"`
	CropId      domain.CropId `json:"cropId"`
	StartDate   time.Time     `json:"startDate"`
	EndDate     time.Time     `json:"endDate"`
}

func (hdl *HTTPHandler) GetCropStats(c *gin.Context) {
	var cropStatsIn CropStatsIn
	err := c.BindJSON(&cropStatsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	cropStats, err := hdl.parcelsService.GetCropStatsByEnclosureIdAndCrop(cropStatsIn.EnclosureId, cropStatsIn.CropId, cropStatsIn.StartDate, cropStatsIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, cropStats)
}

// -----------------------------------------------------------------------

type PhytosanitariesIn struct {
	EnclosureId string        `json:"enclosureId"`
	CropId      domain.CropId `json:"cropId"`
	StartDate   time.Time     `json:"startDate"`
	EndDate     time.Time     `json:"endDate"`
}

func (hdl *HTTPHandler) GetPhytosanitaries(c *gin.Context) {
	var phytosanitariesIn PhytosanitariesIn
	err := c.BindJSON(&phytosanitariesIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	phytosanitaries, err := hdl.parcelsService.GetPhytosanitariesByEnclosureIdAndCrop(phytosanitariesIn.EnclosureId, phytosanitariesIn.CropId, phytosanitariesIn.StartDate, phytosanitariesIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, phytosanitaries)
}

// -----------------------------------------------------------------------

type FertilizersIn struct {
	EnclosureId string        `json:"enclosureId"`
	CropId      domain.CropId `json:"cropId"`
	StartDate   time.Time     `json:"startDate"`
	EndDate     time.Time     `json:"endDate"`
}

func (hdl *HTTPHandler) GetFertilizers(c *gin.Context) {
	var fertilizersIn FertilizersIn
	err := c.BindJSON(&fertilizersIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	fertilizers, err := hdl.parcelsService.GetFertilizersByEnclosureIdAndCrop(fertilizersIn.EnclosureId, fertilizersIn.CropId, fertilizersIn.StartDate, fertilizersIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, fertilizers)
}

// -----------------------------------------------------------------------

type DailyWeatherIn struct {
	ParcelId  string    `json:"parcelId"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func (hdl *HTTPStreamHandler) GetDailyWeather(c *gin.Context) {
	// Controller in channel
	chanStream := make(chan domain.EventOut, 10)
	// Get the info from the request
	var dailyWeatherIn DailyWeatherIn
	err := c.BindJSON(&dailyWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	// Check if the info is in the local database
	data, err := hdl.parcelsService.GetDailyWeatherByParcel(dailyWeatherIn.ParcelId, dailyWeatherIn.StartDate, dailyWeatherIn.EndDate)
	// If the info is not in the local database, send it to event handler, which will send it to the event bus
	if err == apperrors.ErrNotFound {
		hdl.eventHandlerChannelIn <- domain.EventIn{
			ID:        uuid.UUID{},
			EventType: domain.EVENT_TYPE_DAILY_WEATHER,
			Channel:   chanStream,
			Payload:   dailyWeatherIn,
		}
		// If the info is in the local database, send it to the client
	} else {
		c.JSON(200, data)
		return
	}
	// Send the info to the client
	dailyWeather := <-chanStream
	if dailyWeather.ErrorMessage != "" {
		c.AbortWithStatusJSON(500, gin.H{"message": dailyWeather.ErrorMessage})
		return
	}
	c.JSON(200, dailyWeather.Payload)
}

// -----------------------------------------------------------------------

type ForecastWeatherIn struct {
	ParcelId  string    `json:"parcelId"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

func (hdl *HTTPStreamHandler) GetForecastWeather(c *gin.Context) {
	chanStream := make(chan domain.EventOut, 10)
	var forecastWeatherIn ForecastWeatherIn
	err := c.BindJSON(&forecastWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	data, err := hdl.parcelsService.GetForecastWeatherByParcel(forecastWeatherIn.ParcelId, forecastWeatherIn.StartDate, forecastWeatherIn.EndDate)
	if err == apperrors.ErrNotFound {
		hdl.eventHandlerChannelIn <- domain.EventIn{
			ID:        uuid.UUID{},
			EventType: domain.EVENT_TYPE_FORECAST_WEATHER,
			Channel:   chanStream,
			Payload:   forecastWeatherIn,
		}
	} else {
		chanStream <- domain.EventOut{ErrorMessage: domain.EVENT_TYPE_FORECAST_WEATHER, Payload: data}
	}
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-chanStream; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}

// -----------------------------------------------------------------------

type WeatherTempMapIn struct {
	ParcelId string    `json:"parcelId"`
	Date     time.Time `json:"date"`
}

func (hdl *HTTPStreamHandler) GetWeatherTempMap(c *gin.Context) {
	// TODO
	c.AbortWithStatusJSON(501, gin.H{"message": "Not implemented"})
}

// -----------------------------------------------------------------------

type NDVIIn struct {
	EnclosureIds []string  `json:"enclosureIds"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
}

func (hdl *HTTPStreamHandler) GetNDVI(c *gin.Context) {
	chanStream := make(chan domain.EventOut, 10)
	var NDVIIn NDVIIn
	err := c.BindJSON(&NDVIIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	data, err := hdl.parcelsService.GetNDVIByEnclosures(NDVIIn.EnclosureIds, NDVIIn.StartDate, NDVIIn.EndDate)
	if err == apperrors.ErrNotFound {
		hdl.eventHandlerChannelIn <- domain.EventIn{
			ID:        uuid.UUID{},
			EventType: domain.EVENT_TYPE_NDVI,
			Channel:   chanStream,
			Payload:   NDVIIn,
		}
	} else {
		chanStream <- domain.EventOut{ErrorMessage: domain.EVENT_TYPE_NDVI, Payload: data}
	}
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-chanStream; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}

// -----------------------------------------------------------------------

type NDVIMapIn struct {
	EnclosureIds []string  `json:"enclosureIds"`
	StartDate    time.Time `json:"startDate"`
	EndDate      time.Time `json:"endDate"`
}

func (hdl *HTTPStreamHandler) GetNDVIMap(c *gin.Context) {
	chanStream := make(chan domain.EventOut, 10)
	var NDVIMapIn NDVIMapIn
	err := c.BindJSON(&NDVIMapIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	// The NDVI map is not stored in the local database, so it is sent to the event handler and to the bus
	hdl.eventHandlerChannelIn <- domain.EventIn{
		ID:        uuid.UUID{},
		EventType: domain.EVENT_TYPE_NDVI_MAP,
		Channel:   chanStream,
		Payload:   NDVIMapIn,
	}
	c.Stream(func(w io.Writer) bool {
		if msg, ok := <-chanStream; ok {
			c.SSEvent("message", msg)
			return true
		}
		return false
	})
}

// func (hdl *HTTPStreamHandler) SseTest(c *gin.Context) {
// 	chanStream := make(chan domain.EventOut, 10)
// 	parcel := domain.Parcel{
// 		Id: "334rm3434",
// 		Ts: time.Now(),
// 		Geometry: struct {
// 			Type        string    "json:\"type\""
// 			Coordinates []float64 "json:\"coordinates\""
// 		}{
// 			Type:        "Point",
// 			Coordinates: []float64{0, 0},
// 		},
// 	}
// 	chanStream <- domain.EventOut{ErrorMessage: "", Payload: parcel}
// 	c.Stream(func(w io.Writer) bool {
// 		if msg, ok := <-chanStream; ok {
// 			c.SSEvent("message", msg)
// 			return true
// 		}
// 		return false
// 	})
// }
