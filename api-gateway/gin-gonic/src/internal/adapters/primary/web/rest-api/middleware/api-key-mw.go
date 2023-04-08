package middleware

import (
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"strings"

	"github.com/gin-gonic/gin"
)

type apiKeyMiddleware struct {
	authsrv ports.APIKeyService
}

func InitApiKeyMiddleware(authsrv ports.APIKeyService) *apiKeyMiddleware {
	return &apiKeyMiddleware{authsrv: authsrv}
}

func (mw *apiKeyMiddleware) AuthorizeAPIKey(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		apikey := c.Request.Header.Get("X-API-KEY")
		if !strings.HasPrefix(apikey, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		err := mw.authsrv.ValidateAPIKey(strings.Split(apikey, "Bearer ")[1])
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		c.Next()
	}
}
