package handlers

import (
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"github.com/gin-gonic/gin"
)

type EnclosuresHTTPHandler struct {
	enclosuresService ports.EnclosuresService
}

func NewEnclosuresHTTPHandler(parcelService ports.EnclosuresService) *EnclosuresHTTPHandler {
	return &EnclosuresHTTPHandler{
		enclosuresService: parcelService,
	}
}

// -----------------------------------------------------------------------

type ParcelsIn struct {
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
// @Success 200 {object} []ports.Enclosure
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures [get]
func (hdl *EnclosuresHTTPHandler) GetEnclosures(c *gin.Context) {
	enclosuresIn := ParcelsIn{
		Year: 2022,
	}
	err := c.ShouldBind(&enclosuresIn)

	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.enclosuresService.GetEnclosures(enclosuresIn.EnclosureIds, enclosuresIn.Year)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, enclosures)
}

// -----------------------------------------------------------------------

type CropStatsIn struct {
	EnclosureId string    `form:"enclosureId" binding:"required"`
	StartDate   time.Time `form:"startDate" binding:"required"`
	EndDate     time.Time `form:"endDate" binding:"required"`
}

// @Summary Get Crop Stats
// @Description Get Crop Stats
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Enclosure Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Success 200 {object} []ports.Treatment
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /crops [get]
func (hdl *EnclosuresHTTPHandler) GetCropStats(c *gin.Context) {
	var cropStatsIn CropStatsIn
	err := c.ShouldBind(&cropStatsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	cropStats, err := hdl.enclosuresService.GetTreatments(cropStatsIn.EnclosureId, cropStatsIn.StartDate, cropStatsIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, cropStats)
}

// -----------------------------------------------------------------------

type TreatmentsIn struct {
	EnclosureId string    `form:"enclosureId" binding:"required"`
	StartDate   time.Time `form:"startDate" binding:"required"`
	EndDate     time.Time `form:"endDate" binding:"required"`
}

// @Summary Get Treatments
// @Description Get Treatments
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Enclosure Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Success 200 {object} []ports.Treatment
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /treatments [get]
func (hdl *EnclosuresHTTPHandler) GetTreatments(c *gin.Context) {
	var TreatmentsIn TreatmentsIn
	err := c.ShouldBind(&TreatmentsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"enclosureId": "string", "startDate": "time.Time", "endDate": "time.Time"}})
		return
	}
	phytosanitaries, err := hdl.enclosuresService.GetTreatments(TreatmentsIn.EnclosureId, TreatmentsIn.StartDate, TreatmentsIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, phytosanitaries)
}

// -----------------------------------------------------------------------

type FertilizersIn struct {
	EnclosureId string    `form:"enclosureId" binding:"required"`
	StartDate   time.Time `form:"startDate" binding:"required"`
	EndDate     time.Time `form:"endDate" binding:"required"`
}

// @Summary Get Fertilizers
// @Description Get Fertilizers
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Enclosure Id"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Success 200 {object} []ports.Fertilizer
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /fertilizers [get]
func (hdl *EnclosuresHTTPHandler) GetFertilizers(c *gin.Context) {
	var fertilizersIn FertilizersIn
	err := c.ShouldBind(&fertilizersIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	fertilizers, err := hdl.enclosuresService.GetFertilizers(fertilizersIn.EnclosureId, fertilizersIn.StartDate, fertilizersIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, fertilizers)
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
func (hdl *EnclosuresHTTPHandler) GetDailyWeather(c *gin.Context) {
	var dailyWeatherIn DailyWeatherIn
	err := c.ShouldBind(&dailyWeatherIn)

	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"enclosureId": "string, required"}})
		return
	}
	dailyWeather, err := hdl.enclosuresService.GetDailyWeather(dailyWeatherIn.EnclosureId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	if err == nil {
		c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	}
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
func (hdl *EnclosuresHTTPHandler) GetForecastWeather(c *gin.Context) {
	var forecastWeatherIn ForecastWeatherIn
	err := c.ShouldBind(&forecastWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	forecastWeather, err := hdl.enclosuresService.GetForecastWeather(forecastWeatherIn.EnclosureId)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	if err == nil {
		c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	}
	c.JSON(200, forecastWeather)
}

// -----------------------------------------------------------------------

type HistoricalWeatherIn struct {
	Idema     string    `form:"idema" binding:"required"`
	StartDate time.Time `form:"startDate" binding:"required"`
	EndDate   time.Time `form:"endDate" binding:"required"`
}

// @Summary Get Historical Weather
// @Description Get Historical Weather
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param idema query string true "Idema"
// @Param startDate query string true "Start Date"
// @Param endDate query string true "End Date"
// @Success 200 {object} []ports.HistoricalWeather
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /weather/historical [get]
func (hdl *EnclosuresHTTPHandler) GetHistoricalWeather(c *gin.Context) {
	var historicalWeatherIn HistoricalWeatherIn
	err := c.ShouldBind(&historicalWeatherIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"idema": "string, required", "startDate": "string, required", "endDate": "string, required"}})
		return
	}
	historicalWeather, err := hdl.enclosuresService.GetHistoricalWeather(historicalWeatherIn.Idema, historicalWeatherIn.StartDate, historicalWeatherIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	// Don't cache this endpoint when something fails
	if err == nil {
		c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	}
	c.JSON(200, historicalWeather)
}

// -----------------------------------------------------------------------

type NDVIIn struct {
	EnclosureIds []string  `form:"enclosureIds" binding:"required"`
	StartDate    time.Time `form:"startDate"`
	EndDate      time.Time `form:"endDate"`
	Limit        int       `form:"limit" default:"150"`
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
// @Router /ndvi [get]
func (hdl *EnclosuresHTTPHandler) GetNDVI(c *gin.Context) {
	ndviIn := NDVIIn{
		Limit: 150,
	}
	err := c.ShouldBind(&ndviIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error(), "valid_input": map[string]string{"enclosureIds": "[]string, required", "startDate": "time.Time, required", "endDate": "time.Time, required"}})
		return
	}
	ndvi, err := hdl.enclosuresService.GetNDVI(ndviIn.EnclosureIds, ndviIn.StartDate, ndviIn.EndDate, ndviIn.Limit)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, ndvi)
}
