package middleware

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"
	"encoding/base64"
	"encoding/hex"
	"io"

	"github.com/gin-gonic/gin"
)

func decryptData(cipherText string, key []byte, iv []byte) (string, error) {
	// cipherTextDecoded, err := hex.DecodeString(cipherText)
	cipherTextDecoded, err := base64.StdEncoding.DecodeString(cipherText)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks([]byte(cipherTextDecoded), []byte(cipherTextDecoded))
	return string(cipherTextDecoded), nil
}

func encryptData(plainText string, key []byte, iv []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks([]byte(plainText), []byte(plainText))
	return hex.EncodeToString([]byte(plainText)), nil
}

type encryptionMiddleware struct {
	key []byte
	iv  []byte
}

func InitEncryptionMiddleware(iv string, key string) *encryptionMiddleware {
	return &encryptionMiddleware{
		key: []byte(key),
		iv:  []byte(iv),
	}
}

func (mw *encryptionMiddleware) EncryptData(c *gin.Context) {
	data := c.MustGet("data").(string)
	cipherText, err := encryptData(data, mw.key, mw.iv)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInternal.Error()})
	}
	c.JSON(200, gin.H{"result": cipherText})
}

func (mw *encryptionMiddleware) DecryptData(c *gin.Context) {
	var data domain.EncrytedData
	c.BindJSON(&data)
	plainText, err := decryptData(data.Data, mw.key, mw.iv)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInvalidInput.Error()})
		return
	}
	c.Request.Body = io.NopCloser(bytes.NewBufferString(plainText))
}
