package imageshdl

import (
	"bytes"
	"io"
	"mime/multipart"
	"prakticas/backend-gpsoft/src/internal/core/ports"

	"github.com/gin-gonic/gin"
)

type HTTPHandler struct {
	imagesService ports.FileStorageService
}

func NewHTTPHandler(imagesService ports.FileStorageService) *HTTPHandler {
	return &HTTPHandler{
		imagesService: imagesService,
	}
}

type FileIn struct {
	File *multipart.FileHeader `form:"file" binding:"required"`
	Path string                `form:"path" binding:"required"`
}

func (hdl *HTTPHandler) UploadImage(c *gin.Context) {
	var fileIn FileIn
	err := c.Bind(&fileIn)
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error()})
		return
	}
	file, err := fileIn.File.Open()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	defer file.Close()
	buf := new(bytes.Buffer)
	io.Copy(buf, file)
	fileName, err := hdl.imagesService.UploadFile(buf.Bytes(), fileIn.Path)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, fileName)
}
