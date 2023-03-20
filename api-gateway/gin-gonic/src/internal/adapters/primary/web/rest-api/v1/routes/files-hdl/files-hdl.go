package fileshdl

import (
	"bytes"
	"digital-twin/main-server/src/internal/core/ports"
	"io"
	"mime/multipart"

	"github.com/gin-gonic/gin"
)

type HTTPHandler struct {
	imagesService    ports.StorageService
	filesDumpService ports.StorageService
}

func NewHTTPHandler(imagesService ports.StorageService, filesDumpService ports.StorageService) *HTTPHandler {
	return &HTTPHandler{
		imagesService:    imagesService,
		filesDumpService: filesDumpService,
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
	fileName, err := hdl.imagesService.UploadFile(buf.Bytes(), "", fileIn.Path)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, fileName)
}

func (hdl *HTTPHandler) UploadFiles(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error()})
		return
	}
	files := form.File["files"]

	for _, fileIn := range files {
		file, err := fileIn.Open()
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
		defer file.Close()
		buf := new(bytes.Buffer)
		io.Copy(buf, file)
		_, err = hdl.filesDumpService.UploadFile(buf.Bytes(), fileIn.Filename, "")
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
	}
}
