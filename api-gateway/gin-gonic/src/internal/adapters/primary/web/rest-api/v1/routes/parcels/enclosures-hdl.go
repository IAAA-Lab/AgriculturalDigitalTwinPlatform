package parcelshdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"github.com/gin-gonic/gin"
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
	UserId       string   `form:"userId"`
	EnclosureIds []string `form:"enclosureIds"`
}

func (hdl *HTTPHandler) PostParcelRefs(c *gin.Context) {
	var parcelRefsIn PostParcelRefsIn
	err := c.ShouldBind(&parcelRefsIn)
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
	UserId string `form:"userId"`
}

func (hdl *HTTPHandler) GetUserParcels(c *gin.Context) {
	var parcelRefsIn ParcelRefsIn
	err := c.ShouldBind(&parcelRefsIn)
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

type ParcelsIn struct {
	EnclosureIds []string `form:"enclosureIds"`
}

func (hdl *HTTPHandler) GetEnclosures(c *gin.Context) {
	var enclosuresIn ParcelsIn
	err := c.ShouldBind(&enclosuresIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.parcelsService.GetParcels(enclosuresIn.EnclosureIds)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, enclosures)
}

// -----------------------------------------------------------------------

type ParcelsSummary struct {
	UserId string `form:"userId"`
}

func (hdl *HTTPHandler) GetParcelsSummary(c *gin.Context) {
	var parcelsSummary ParcelsSummary
	err := c.ShouldBind(&parcelsSummary)
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
	EnclosureId string    `form:"enclosureId"`
	StartDate   time.Time `form:"startDate"`
	EndDate     time.Time `form:"endDate"`
}

func (hdl *HTTPHandler) GetCropStats(c *gin.Context) {
	var cropStatsIn CropStatsIn
	err := c.ShouldBind(&cropStatsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	cropStats, err := hdl.parcelsService.GetPhytosanitaries(cropStatsIn.EnclosureId, cropStatsIn.StartDate, cropStatsIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, cropStats)
}

// -----------------------------------------------------------------------

type PhytosanitariesIn struct {
	EnclosureId string    `form:"enclosureId"`
	StartDate   time.Time `form:"startDate"`
	EndDate     time.Time `form:"endDate"`
}

func (hdl *HTTPHandler) GetPhytosanitaries(c *gin.Context) {
	var phytosanitariesIn PhytosanitariesIn
	err := c.ShouldBind(&phytosanitariesIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	phytosanitaries, err := hdl.parcelsService.GetPhytosanitaries(phytosanitariesIn.EnclosureId, phytosanitariesIn.StartDate, phytosanitariesIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, phytosanitaries)
}

// -----------------------------------------------------------------------

type FertilizersIn struct {
	EnclosureId string    `form:"enclosureId"`
	StartDate   time.Time `form:"startDate"`
	EndDate     time.Time `form:"endDate"`
}

func (hdl *HTTPHandler) GetFertilizers(c *gin.Context) {
	var fertilizersIn FertilizersIn
	err := c.ShouldBind(&fertilizersIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	fertilizers, err := hdl.parcelsService.GetFertilizers(fertilizersIn.EnclosureId, fertilizersIn.StartDate, fertilizersIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, fertilizers)
}

// -----------------------------------------------------------------------

type DailyWeatherIn struct {
	ParcelId string    `form:"parcelId"`
	Date     time.Time `form:"date"`
}

func (hdl *HTTPHandler) GetDailyWeather(c *gin.Context) {
	var dailyWeatherIn DailyWeatherIn
	err := c.ShouldBind(&dailyWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	dailyWeather, err := hdl.parcelsService.GetDailyWeather(dailyWeatherIn.ParcelId, dailyWeatherIn.Date)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, dailyWeather)
}

// -----------------------------------------------------------------------

type ForecastWeatherIn struct {
	ParcelId string `form:"parcelId"`
}

func (hdl *HTTPHandler) GetForecastWeather(c *gin.Context) {
	var forecastWeatherIn ForecastWeatherIn
	err := c.ShouldBind(&forecastWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	forecastWeather, err := hdl.parcelsService.GetForecastWeather(forecastWeatherIn.ParcelId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, forecastWeather)
}

// -----------------------------------------------------------------------

type NDVIIn struct {
	EnclosureIds []string  `form:"enclosureIds"`
	StartDate    time.Time `form:"startDate"`
	EndDate      time.Time `form:"endDate"`
}

func (hdl *HTTPHandler) GetNDVI(c *gin.Context) {
	var ndviIn NDVIIn
	err := c.ShouldBind(&ndviIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	ndvi, err := hdl.parcelsService.GetNDVI(ndviIn.EnclosureIds, ndviIn.StartDate, ndviIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, ndvi)
}

// -----------------------------------------------------------------------

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
