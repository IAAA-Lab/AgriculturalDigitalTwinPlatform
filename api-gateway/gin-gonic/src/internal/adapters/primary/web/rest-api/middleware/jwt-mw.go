package middleware

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type jwtMiddleware struct {
	authsrv ports.JWTService
	usersrv ports.UsersService
	envMode string
}

func InitJwtMiddleware(authsrv ports.JWTService, usersrv ports.UsersService, envMode string) *jwtMiddleware {
	return &jwtMiddleware{authsrv: authsrv, usersrv: usersrv, envMode: envMode}
}

func (mw *jwtMiddleware) AuthorizeJWT(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		accesstokenCookies := c.Request.Header.Get("Authorization")
		if !strings.HasPrefix(accesstokenCookies, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		accesstoken, err := mw.authsrv.ValidateToken(strings.Split(accesstokenCookies, "Bearer ")[1])

		if err != nil || !accesstoken.Valid {
			c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized.Error())
			return
		}
		claims := accesstoken.Claims.(jwt.MapClaims)

		if roles == nil {
			c.Next()
			return
		}

		for _, role := range roles {
			if role == claims["role"].(string) {
				c.Set("userInfo", claims)
				c.Next()
				return
			}
		}
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized.Error())
	}
}

func (mw *jwtMiddleware) ReturnJWT(c *gin.Context) {
	user, ok := c.MustGet("user").(domain.User)
	if !ok {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInternal})
		return
	}
	accesstoken := mw.authsrv.GenerateAccessToken(user)
	refreshtoken := mw.authsrv.GenerateRefreshToken(user)
	// Set cookie that expires in 5 days
	c.SetCookie("refreshtoken", refreshtoken, 60*60*24*5, "/", "", false, true)
	c.JSON(200, accesstoken)
}

func (mw *jwtMiddleware) RefreshJWT(c *gin.Context) {
	refreshtokenCookie, err := c.Request.Cookie("refreshtoken")

	if err != nil {
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized)
		return
	}

	refreshtoken, err := mw.authsrv.ValidateToken(refreshtokenCookie.Value)

	if err != nil || !refreshtoken.Valid {
		c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized.Error()})
		return
	}
	claims := refreshtoken.Claims.(jwt.MapClaims)
	objID, err := primitive.ObjectIDFromHex(claims["user_id"].(string))

	if err != nil {
		panic(err)
	}
	user := domain.User{
		ID:    objID,
		Email: claims["user"].(string),
		Role:  claims["role"].(string),
	}
	_, err = mw.usersrv.FetchUser(user.ID.Hex())

	if err != nil {
		c.AbortWithStatusJSON(404, apperrors.ErrNotFound)
		return
	}
	accesstoken := mw.authsrv.GenerateAccessToken(user)
	c.JSON(200, accesstoken)
}

func (mw *jwtMiddleware) RevokeJWT(c *gin.Context) {
	// Delete cookie
	c.SetCookie("refreshtoken", "", -1, "/", "", false, true)
	c.JSON(200, gin.H{"message": "Successfully logged out"})
}
