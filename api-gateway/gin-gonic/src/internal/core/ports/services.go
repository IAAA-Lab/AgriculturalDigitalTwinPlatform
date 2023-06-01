package ports

import (
	"digital-twin/main-server/src/internal/core/domain"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id string) (domain.User, error)
	FetchUserByEmail(email string) (domain.User, error)
	DeleteUser(id string) error
	PostNewUser(user domain.User) error
	PostEnclosure(email string, enclosureIds []string) error
}

type EnclosuresService interface {
	GetForecastWeather(enclosureId string) (domain.ForecastWeather, error)
	GetDailyWeather(enclosureId string) (domain.DailyWeather, error)
	GetHistoricalWeather(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.HistoricalWeather, error)
	GetEnclosures(enclosureIds []string, year int16) ([]domain.Enclosure, error)
	GetNDVI(enclosureIds []string, startDate time.Time, endDate time.Time, limit int) ([]domain.NDVI, error)
	GetFarmHolder(id domain.FarmHolderId) (domain.FarmHolder, error)
	GetActivities(enclosureId string, startDate time.Time, endDate time.Time) ([]domain.Activity, error)
	FetchAllEnclosureIds() ([]string, error)
}

type JWTService interface {
	GenerateAccessToken(user domain.User) string
	GenerateRefreshToken(user domain.User) string
	ValidateToken(token string) (*jwt.Token, error)
	DeleteRefreshToken(userId string)
	GetRefreshToken(userId string) (string, error)
}

type APIKeyService interface {
	GenerateAPIKey() (string, error)
	ValidateAPIKey(key string) error
}

type StorageService interface {
	GetFile(fileName string, bucket string, path string) ([]byte, error)
	UploadFile(file []byte, fileName string, bucket string, path string) error
}
