package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
)

func Ase256Decode(cipherText string, encKey string, iv string) (decryptedString []byte) {
	bKey := []byte(encKey)
	bIV := []byte(iv)
	cipherTextDecoded, err := hex.DecodeString(cipherText)
	if err != nil {
		panic(err)
	}
	block, err := aes.NewCipher(bKey)
	if err != nil {
		panic(err)
	}
	mode := cipher.NewCBCDecrypter(block, bIV)
	mode.CryptBlocks([]byte(cipherTextDecoded), []byte(cipherTextDecoded))
	return cipherTextDecoded
}
