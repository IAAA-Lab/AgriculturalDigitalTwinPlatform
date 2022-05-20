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
}

//auth-jwt
func JWTAuthService() ports.JWTService {
	return &jwtServices{
		secretKey: getSecretKey(),
		issure:    "Agrarian",
	}
}

func getSecretKey() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "secsjdhf8,/f*eDjh3uyDBHDJBret"
	}
	return secret
}

func (service *jwtServices) GenerateToken(user string, role string) string {
	claims := &domain.AuthCustomClaims{
		user,
		role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
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

func (service *jwtServices) ValidateToken(encodedToken string) (*jwt.Token, error) {
	return jwt.Parse(encodedToken, func(token *jwt.Token) (interface{}, error) {
		if _, isvalid := token.Method.(*jwt.SigningMethodHMAC); !isvalid {
			return nil, apperrors.ErrUnauthorized
		}
		return []byte(service.secretKey), nil
	})

}
