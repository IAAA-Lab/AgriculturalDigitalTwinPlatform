package handlers

import (
	"bytes"
	"digital-twin/main-server/src/internal/core/ports"
	"fmt"
	"io"
	"mime/multipart"
	"os"

	"github.com/gin-gonic/gin"
)

type FilesHTTPHandler struct {
	storageService ports.StorageService
}

func NewFilesHTTPHandler(storageService ports.StorageService) *FilesHTTPHandler {
	return &FilesHTTPHandler{
		storageService: storageService,
	}
}

type FileIn struct {
	File *multipart.FileHeader `form:"file" binding:"required"`
	Path string                `form:"path" binding:"required"`
}

// @Summary Upload image
// @Description Upload image
// @Tags files
// @Accept  multipart/form-data
// @Produce  json
// @Param file formData file true "file"
// @Param path formData string true "path"
// @Success 201 {string} string "file name"
// @Failure 400 {object} Error "Bad request"
// @Failure 500 {object} Error "Internal server error"
// @Router /files/images [post]
func (hdl *FilesHTTPHandler) UploadActivitiesFiles(c *gin.Context) {
	digitalTwinId := c.Param("id")
	form, err := c.MultipartForm()
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error()})
		return
	}
	files := form.File["files"]
	landingBucket := os.Getenv("MINIO_LANDING_ZONE")
	for _, fileIn := range files {
		file, err := fileIn.Open()
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
		defer file.Close()
		buf := new(bytes.Buffer)
		io.Copy(buf, file)
		err = hdl.storageService.UploadFile(buf.Bytes(), fileIn.Filename, landingBucket, digitalTwinId,
			map[string]string{"digital-twin-id": digitalTwinId, "type": "activity"})
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
	}
}

func (hdl *FilesHTTPHandler) UploadYieldFiles(c *gin.Context) {
	digitalTwinId := c.Param("id")
	form, err := c.MultipartForm()
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error()})
		return
	}
	files := form.File["files"]
	landingBucket := os.Getenv("MINIO_LANDING_ZONE")
	for _, fileIn := range files {
		file, err := fileIn.Open()
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
		defer file.Close()
		buf := new(bytes.Buffer)
		io.Copy(buf, file)
		fmt.Println("Uploading file", digitalTwinId)
		err = hdl.storageService.UploadFile(buf.Bytes(), fileIn.Filename, landingBucket, digitalTwinId,
			map[string]string{"digital-twin-id": digitalTwinId, "type": "yield"})
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
	}
}
