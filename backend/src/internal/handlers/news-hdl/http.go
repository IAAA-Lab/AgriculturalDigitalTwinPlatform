package newshdl

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HTTPHandler struct {
	newsService ports.NewsService
}

func NewHTTPHandler(newsService ports.NewsService) *HTTPHandler {
	return &HTTPHandler{
		newsService: newsService,
	}
}

func (hdl *HTTPHandler) Get(c *gin.Context) {
	numPage, err := strconv.ParseInt(c.Query("numPage"), 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	news, err := hdl.newsService.FetchAll(numPage)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, news)
}

func (hdl *HTTPHandler) GetDesc(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	desc, err := hdl.newsService.Fetch(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, desc)
}

func (hdl *HTTPHandler) GetNumber(c *gin.Context) {
	number, err := hdl.newsService.FetchNumber()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, number)
}

func (hdl *HTTPHandler) PostNewNews(c *gin.Context) {
	var news domain.PostNew
	c.BindJSON(&news)
	err := hdl.newsService.PostNewNews(news)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, nil)
}
