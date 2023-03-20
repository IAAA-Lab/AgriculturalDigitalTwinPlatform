package apikeymw

import (
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"strings"

	"github.com/gin-gonic/gin"
)

type service struct {
	authsrv ports.APIKeyService
}

func Init(authsrv ports.APIKeyService) *service {
	return &service{authsrv: authsrv}
}

func (srv *service) AuthorizeAPIKey(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		apikey := c.Request.Header.Get("X-API-KEY")
		if !strings.HasPrefix(apikey, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		err := srv.authsrv.ValidateAPIKey(strings.Split(apikey, "Bearer ")[1])
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		c.Next()
	}
}
