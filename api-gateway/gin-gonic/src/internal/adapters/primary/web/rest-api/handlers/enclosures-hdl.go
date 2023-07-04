package handlers

import (
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"strings"
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
// @Success 200 {object} []ports.Enclosure
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /enclosures [get]
func (hdl *EnclosuresHTTPHandler) GetEnclosures(c *gin.Context) {
	var enclosuresIn EnclosuresIn
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
	// Don't cache this endpoint when something fails
	if err == nil {
		c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	}
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
func (hdl *EnclosuresHTTPHandler) GetEnclosuresInRadius(c *gin.Context) {
	enclosureId := c.Param("id")
	var enclosuresInRadiusIn EnclosuresInRadiusIn
	err := c.ShouldBind(&enclosuresInRadiusIn)
	fmt.Println(enclosuresInRadiusIn, enclosureId)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	enclosures, err := hdl.enclosuresService.GetEnclosuresInRadius(enclosureId, enclosuresInRadiusIn.Radius, enclosuresInRadiusIn.Year)
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

// @Summary Get Crops Stats
// @Description Get Crops Stats
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Enclosure Id"
// @Param startDate query date false "Start Date"
// @Param endDate query date false "End Date"
// @Success 200 {object} []ports.Crop
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /crops [get]
func (hdl *EnclosuresHTTPHandler) GetCropStats(c *gin.Context) {
	var cropsIn CropStatsIn
	err := c.ShouldBind(&cropsIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"enclosureId": "string, required", "startDate": "date, optional", "endDate": "date, optional"}})
		return
	}
	crops, err := hdl.enclosuresService.GetCropStats(cropsIn.EnclosureId, cropsIn.StartDate, cropsIn.EndDate)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	c.JSON(200, crops)
}

type ActivitiesIn struct {
	EnclosureIds []string  `form:"enclosureId" binding:"required"`
	StartDate    time.Time `form:"startDate"`
	EndDate      time.Time `form:"endDate"`
	Limit        int       `form:"limit" default:"365"`
}

// @Summary Get Activities
// @Description Get Activities
// @Tags Enclosures
// @Accept  json
// @Produce  json
// @Param enclosureId query string true "Enclosure Id"
// @Param date query string true "Date"
// @Success 200 {object} []ports.Treatment
// @Failure 400 {object} apperrors.Error
// @Failure 500 {object} apperrors.Error
// @Router /activities [post]
func (hdl *EnclosuresHTTPHandler) GetActivities(c *gin.Context) {
	activitiesIn := ActivitiesIn{
		Limit: 365,
	}
	err := c.ShouldBind(&activitiesIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error(), "valid_input": map[string]string{"enclosureId": "string, required", "date": "string, required"}})
		return
	}
	activities, err := hdl.enclosuresService.GetActivities(activitiesIn.EnclosureIds, activitiesIn.StartDate, activitiesIn.EndDate, activitiesIn.Limit)
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
func (hdl *EnclosuresHTTPHandler) GetHistoricalWeather(c *gin.Context) {
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
	historicalWeather, err := hdl.enclosuresService.GetHistoricalWeather(historicalWeatherIn.Idema, historicalWeatherIn.StartDate, historicalWeatherIn.EndDate, fields)
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
	Limit        int       `form:"limit" default:"365"`
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
func (hdl *EnclosuresHTTPHandler) GetNDVI(c *gin.Context) {
	ndviIn := NDVIIn{
		Limit: 365,
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
	// Don't cache this endpoint when something fails
	if err == nil {
		c.Writer.Header().Set("Cache-Control", "public, max-age=1800")
	}
	c.JSON(200, ndvi)
}
