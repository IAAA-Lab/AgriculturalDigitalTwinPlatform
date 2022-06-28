package ports

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewsService interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id primitive.ObjectID) (domain.Description, error)
	PostNewNews(news domain.PostNews) error
	UpdateNews(id primitive.ObjectID, news domain.PostNews) error
	DeleteNews(id primitive.ObjectID) error
}

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.UserNoPasswd, error)
	FetchUser(id primitive.ObjectID) (domain.UserNoPasswd, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type JWTService interface {
	GenerateAccessToken(user domain.User) string
	GenerateRefreshToken(user domain.User) string
	ValidateToken(token string) (*jwt.Token, error)
	DeleteRefreshToken(userId string)
	GetRefreshToken(userId string) (string, error)
}

type EncryptionService interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheService interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}
