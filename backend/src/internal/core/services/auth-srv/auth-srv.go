package authsrv

import (
	"os"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type jwtServices struct {
	secretKey string
	issure    string
	cache     ports.CacheService
}

//auth-jwt
func JWTAuthService(cache ports.CacheService) ports.JWTService {
	return &jwtServices{
		secretKey: getSecretKey(),
		issure:    "Agrarian",
		cache:     cache,
	}
}

func getSecretKey() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "secsjdhf8,/f*eDjh3uyDBHDJBret"
	}
	return secret
}

func (service *jwtServices) generateToken(user domain.User, timeExp time.Duration) string {
	claims := &domain.AuthCustomClaims{
		user.ID.Hex(),
		user.Username,
		user.Role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(timeExp).Unix(),
			Issuer:    service.issure,
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	//encoded string
	t, err := token.SignedString([]byte(service.secretKey))
	if err != nil {
		panic(err)
	}
	return t
}

func (service *jwtServices) GenerateRefreshToken(user domain.User) string {
	service.DeleteRefreshToken(user.ID.String())
	rt := service.generateToken(user, time.Hour*24*3)
	service.cache.Set(user.ID.String(), rt, time.Hour*24*3)
	return rt
}

func (service *jwtServices) GenerateAccessToken(user domain.User) string {
	return service.generateToken(user, time.Hour*2)
}

func (service *jwtServices) DeleteRefreshToken(userId string) {
	service.cache.Delete(userId)
}

func (service *jwtServices) GetRefreshToken(userId string) (string, error) {
	return service.cache.Get(userId)
}

func (service *jwtServices) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, apperrors.ErrUnauthorized
		}
		return []byte(service.secretKey), nil
	})
}
