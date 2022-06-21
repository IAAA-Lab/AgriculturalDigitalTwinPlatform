package encryptionrepo

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
)

type aes256Alg struct {
	key []byte
	iv  []byte
}

func NewEncrypter(key string, iv string) *aes256Alg {
	return &aes256Alg{
		key: []byte(key),
		iv:  []byte(iv),
	}
}

func (alg *aes256Alg) DecryptData(cipherText string) (string, error) {
	cipherTextDecoded, err := hex.DecodeString(cipherText)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(alg.key)
	if err != nil {
		return "", err
	}
	mode := cipher.NewCBCDecrypter(block, alg.iv)
	mode.CryptBlocks([]byte(cipherTextDecoded), []byte(cipherTextDecoded))
	return string(cipherTextDecoded), nil
}

func (alg *aes256Alg) EncryptData(plainText string) (string, error) {
	block, err := aes.NewCipher(alg.key)
	if err != nil {
		return "", err
	}
	mode := cipher.NewCBCEncrypter(block, alg.iv)
	mode.CryptBlocks([]byte(plainText), []byte(plainText))
	return hex.EncodeToString([]byte(plainText)), nil
}
