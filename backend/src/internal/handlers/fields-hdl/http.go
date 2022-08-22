package fieldshdl

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"strconv"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HTTPHandler struct {
	fieldsService ports.FieldsService
}

func NewHTTPHandler(fieldsService ports.FieldsService) *HTTPHandler {
	return &HTTPHandler{
		fieldsService: fieldsService,
	}
}

func (hdl *HTTPHandler) GetParcelsByUser(c *gin.Context) {
	userInfo := c.MustGet("userInfo").(jwt.MapClaims)
	year, err := strconv.ParseInt(c.Query("year"), 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	userId, err := primitive.ObjectIDFromHex(userInfo["user_id"].(string))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	res, err := hdl.fieldsService.GetParcels(userId, int(year))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, res)
}

func (hdl *HTTPHandler) PostParcelsAndEnclosures(c *gin.Context) {
	userInfo := c.MustGet("userInfo").(jwt.MapClaims)
	var parcelRefs []domain.ParcelRefs
	err := c.BindJSON(&parcelRefs)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	userId, err := primitive.ObjectIDFromHex(userInfo["user_id"].(string))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	err = hdl.fieldsService.PostParcelsAndEnclosures(userId, parcelRefs)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, err)
}

func (hdl *HTTPHandler) GetParcelRefs(c *gin.Context) {
	userId, err := primitive.ObjectIDFromHex(c.Query("userId"))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	res, err := hdl.fieldsService.GetParcelRefs(userId, 2014)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, res)
}

func (hdl *HTTPHandler) PostParcelRefs(c *gin.Context) {
	userId, err := primitive.ObjectIDFromHex(c.Query("userId"))

	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	var parcelRefs []domain.ParcelRefs
	err = c.BindJSON(&parcelRefs)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	err = hdl.fieldsService.PostParcelsAndEnclosures(userId, parcelRefs)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, err)
}
