package middleware

import (
	authsrv "prakticas/backend-gpsoft/src/internal/core/services/auth-srv"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func AuthorizeJWT(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken := c.Request.Header.Get("Authorization")
		if !strings.HasPrefix(jwtToken, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		token, err := authsrv.JWTAuthService().ValidateToken(strings.Split(jwtToken, "Bearer ")[1])
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		if roles == nil {
			c.Next()
			return
		}
		for _, role := range roles {
			if role == claims["role"].(string) {
				c.Next()
				return
			}
		}
	}

}
