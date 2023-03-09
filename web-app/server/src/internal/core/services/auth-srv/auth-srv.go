package authsrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type jwtService struct {
	secretKey string
	issure    string
	cache     ports.CacheService
}

// auth-jwt
func JWTAuthService(cache ports.CacheService) ports.JWTService {
	return &jwtService{
		secretKey: getSecretKey(),
		issure:    "Agrarian",
		cache:     cache,
	}
}

func getSecretKey() string {
	secret := os.Getenv("JWT_SECRET")
	return secret
}

func (service *jwtService) generateToken(user domain.User, timeExp time.Duration) string {
	claims := &domain.AuthCustomClaims{
		user.ID.Hex(),
		user.Email,
		user.Role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(timeExp).Unix(),
			Issuer:    service.issure,
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(service.secretKey))
	if err != nil {
		panic(err)
	}
	return t
}

func (service *jwtService) GenerateRefreshToken(user domain.User) string {
	service.DeleteRefreshToken(user.ID.String())
	rt := service.generateToken(user, time.Hour*24*3)
	service.cache.Set(user.ID.String(), rt, time.Hour*24*3)
	return rt
}

func (service *jwtService) GenerateAccessToken(user domain.User) string {
	return service.generateToken(user, time.Hour*2)
}

func (service *jwtService) DeleteRefreshToken(userId string) {
	service.cache.Delete(userId)
}

func (service *jwtService) GetRefreshToken(userId string) (string, error) {
	return service.cache.Get(userId)
}

func (service *jwtService) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, apperrors.ErrUnauthorized
		}
		return []byte(service.secretKey), nil
	})
}
