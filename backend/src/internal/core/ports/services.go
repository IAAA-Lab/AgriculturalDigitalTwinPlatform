package ports

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewsService interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.New, error)
	Fetch(id primitive.ObjectID) (domain.Description, error)
	PostNewNews(news domain.PostNew) error
}

type UsersService interface {
	CheckLogin(username string, password string) (domain.User, error)
	FetchAllUsers() ([]domain.UserNoPasswd, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type JWTService interface {
	GenerateToken(user string, role string) string
	ValidateToken(token string) (*jwt.Token, error)
}
