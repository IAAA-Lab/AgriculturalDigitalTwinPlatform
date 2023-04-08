package middleware

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"strings"
	"time"

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
		jwtToken := c.Request.Header.Get("Authorization")
		if mw.envMode == "LOCAL" {
			c.Next()
			return
		}
		if !strings.HasPrefix(jwtToken, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		token, err := mw.authsrv.ValidateToken(strings.Split(jwtToken, "Bearer ")[1])
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
				c.Set("userInfo", claims)
				c.Next()
				return
			}
		}
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
	c.SetCookie("refreshtoken", refreshtoken, int(time.Hour.Seconds()*24*3), "/", "", false, true)
	c.JSON(200, gin.H{"accesstoken": accesstoken})
}

func (mw *jwtMiddleware) RefreshJWT(c *gin.Context) {
	refreshtokenCookie, err := c.Request.Cookie("refreshtoken")
	if err != nil {
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized)
		return
	}
	refreshtoken, err := mw.authsrv.ValidateToken(refreshtokenCookie.Value)
	if err != nil || !refreshtoken.Valid {
		c.AbortWithStatusJSON(401, gin.H{"message": "refresh token invalid"})
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
	c.JSON(200, gin.H{"accesstoken": accesstoken})
}

func (mw *jwtMiddleware) RevokeJWT(c *gin.Context) {
	refreshtokenCookie, err := c.Request.Cookie("refreshtoken")
	if err != nil {
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized)
		return
	}
	refreshtoken, err := mw.authsrv.ValidateToken(refreshtokenCookie.Value)
	if err != nil || !refreshtoken.Valid {
		c.AbortWithStatusJSON(401, gin.H{"message": "refresh token invalid"})
		return
	}
	claims := refreshtoken.Claims.(jwt.MapClaims)
	mw.authsrv.DeleteRefreshToken(claims["user_id"].(string))
	c.SetCookie("refreshtoken", "", -1, "/", "", false, true)
	c.AbortWithStatusJSON(200, gin.H{"message": "Token revoked"})
}
