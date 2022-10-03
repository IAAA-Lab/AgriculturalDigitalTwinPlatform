package localfilestoragerepo

import (
	"bytes"
	"image"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/disintegration/imaging"
)

type LocalFileStorage struct {
	rootPath string
}

func NewLocalFileStorage(rootPath string) *LocalFileStorage {
	return &LocalFileStorage{rootPath}
}

func (l *LocalFileStorage) GetFile(fileName string, path string) ([]byte, error) {
	file, err := os.Open(filepath.Join(l.rootPath, path, fileName))
	if err != nil {
		return nil, err
	}
	defer file.Close()
	fileInfo, err := file.Stat()
	if err != nil {
		return nil, err
	}
	fileSize := fileInfo.Size()
	buffer := make([]byte, fileSize)
	_, err = file.Read(buffer)
	if err != nil {
		return nil, err
	}
	return buffer, nil
}

func (l *LocalFileStorage) UploadImage(img []byte, fileName string, path string) (string, error) {
	img1, _, err := image.Decode(bytes.NewReader(img))
	if err != nil {
		return "", err
	}
	imgResized := imaging.Resize(img1, 860, 0, imaging.Lanczos)
	imgResizedBytes := new(bytes.Buffer)
	err = imaging.Encode(imgResizedBytes, imgResized, imaging.PNG)
	if err != nil {
		return "", err
	}
	imaging.Save(imgResized, filepath.Join(l.rootPath, path, fileName))
	return fileName, nil
}

func (l *LocalFileStorage) UploadFile(file []byte, fileName string, path string) (string, error) {
	err := os.MkdirAll(filepath.Join(l.rootPath, path), os.ModePerm)
	if err != nil {
		return "", err
	}
	filePath := filepath.Join(l.rootPath, path, fileName)
	err = ioutil.WriteFile(filePath, file, os.ModePerm)
	if err != nil {
		return "", err
	}
	return fileName, nil
}

func (l *LocalFileStorage) DeleteFile(fileName string, path string) error {
	return os.Remove(filepath.Join(l.rootPath, path, fileName))
}
