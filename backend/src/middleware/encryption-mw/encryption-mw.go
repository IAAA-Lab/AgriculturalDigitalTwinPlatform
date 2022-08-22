package encryptionmw

import (
	"bytes"
	"io/ioutil"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"

	"github.com/gin-gonic/gin"
)

type service struct {
	encryptsrv ports.EncryptionService
}

func Init(encryptsrv ports.EncryptionService) *service {
	return &service{encryptsrv: encryptsrv}
}

func (srv *service) EncryptData(c *gin.Context) {
	data := c.MustGet("data").(string)
	cipherText, err := srv.encryptsrv.EncryptData(data)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInternal.Error()})
	}
	c.JSON(200, gin.H{"result": cipherText})
}

func (srv *service) DecryptData(c *gin.Context) {
	var data domain.EncrytedData
	c.BindJSON(&data)
	plainText, err := srv.encryptsrv.DecryptData(data.Data)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	c.Request.Body = ioutil.NopCloser(bytes.NewBufferString(plainText))
}
