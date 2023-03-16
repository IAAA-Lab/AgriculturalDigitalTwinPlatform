package newshdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

type HTTPHandler struct {
	newsService ports.NewsService
}

func NewHTTPHandler(newsService ports.NewsService) *HTTPHandler {
	return &HTTPHandler{
		newsService: newsService,
	}
}

type NewsOut struct {
	News   []domain.News `json:"news"`
	Number int64         `json:"number"`
}

func (hdl *HTTPHandler) FetchAll(c *gin.Context) {
	numPage, err := strconv.ParseInt(c.Query("numPage"), 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	news, number, _ := hdl.newsService.FetchAll(numPage)
	c.JSON(200, NewsOut{News: news, Number: number})
}

func (hdl *HTTPHandler) Fetch(c *gin.Context) {
	id := c.Param("id")
	news, err := hdl.newsService.Fetch(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, news)
}

type PostNewsIn struct {
	Info domain.News `json:"info" binding:"required"`
}

func (hdl *HTTPHandler) PostNews(c *gin.Context) {
	var newsIn PostNewsIn
	c.BindJSON(&newsIn)
	newsIn.Info.Content = utils.EscapeHTMLBack(newsIn.Info.Content)
	err := hdl.newsService.PostNewNews(newsIn.Info)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, nil)
}

func (hdl *HTTPHandler) UpdateNews(c *gin.Context) {
	id := c.Param("id")
	var news domain.News
	c.BindJSON(&news)
	news.Content = utils.EscapeHTMLBack(news.Content)
	err := hdl.newsService.UpdateNews(id, news)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(204, nil)
}

func (hdl *HTTPHandler) DeleteNews(c *gin.Context) {
	id := c.Param("id")
	err := hdl.newsService.DeleteNews(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(204, nil)
}
