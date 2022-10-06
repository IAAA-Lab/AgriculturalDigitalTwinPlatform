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
	Fetch(id primitive.ObjectID) (domain.News, error)
	PostNewNews(news domain.News) error
	UpdateNews(id primitive.ObjectID, news domain.News) error
	DeleteNews(id primitive.ObjectID) error
}

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id primitive.ObjectID) (domain.User, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type ParcelsService interface {
	GetParcels(userId primitive.ObjectID, anyo int) ([]domain.Parcel, error)
	PostParcelsAndEnclosures(userId primitive.ObjectID, parcels []domain.ParcelRefs) error
	GetParcelRefs(userId primitive.ObjectID, anyo int) ([]domain.ParcelRefs, error)
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

type FileStorageService interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadFile(file []byte, path string) (string, error)
	DeleteFile(fileName string, path string) error
}
