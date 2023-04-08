package handlers

import (
	"bytes"
	"digital-twin/main-server/src/internal/core/ports"
	"io"
	"mime/multipart"
	"os"

	"github.com/gabriel-vasile/mimetype"
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
func (hdl *FilesHTTPHandler) UploadFiles(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.AbortWithStatusJSON(400, gin.H{"message": err.Error()})
		return
	}
	files := form.File["files"]
	landingBucket := os.Getenv("MINIO_LANDING_BUCKET_NAME")
	for _, fileIn := range files {
		file, err := fileIn.Open()
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
		defer file.Close()
		buf := new(bytes.Buffer)
		io.Copy(buf, file)
		err = hdl.storageService.UploadFile(buf.Bytes(), fileIn.Filename, landingBucket, "")
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
	}
}

// @Summary Get image
// @Description Get image
// @Tags files
// @Accept  json
// @Produce  json
// @Param filename path string true "filename"
// @Success 200 {string} string "file name"
// @Failure 400 {object} Error "Bad request"
// @Failure 500 {object} Error "Internal server error"
// @Router /files/{filename} [get]
func (hdl *FilesHTTPHandler) GetImage(c *gin.Context) {
	filename := c.Param("filename")
	if filename == "" {
		c.AbortWithStatusJSON(400, gin.H{"message": "filename is required"})
		return
	}
	imagesBucket := os.Getenv("MINIO_IMAGES_BUCKET_NAME")
	file, err := hdl.storageService.GetFile(filename, imagesBucket, "")
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Writer.Header().Set("Cache-Control", "max-age=86400")
	// Get mimetype from file
	mimetype, err := mimetype.DetectReader(bytes.NewReader(file))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Data(200, mimetype.String(), file)
}
