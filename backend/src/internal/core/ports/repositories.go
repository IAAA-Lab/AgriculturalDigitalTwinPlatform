package ports

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewsRepository interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id primitive.ObjectID) (domain.Description, error)
	PostNewNews(news domain.PostNews) error
}

type UsersRepository interface {
	CheckLogin(username string, password []byte) (domain.User, error)
	FetchAllUsers() ([]domain.UserNoPasswd, error)
	FetchUser(id primitive.ObjectID) (domain.UserNoPasswd, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type EncryptionRepository interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}
