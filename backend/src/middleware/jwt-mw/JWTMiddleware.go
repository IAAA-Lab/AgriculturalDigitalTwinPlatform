package jwtmw

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	authsrv ports.JWTService
	usersrv ports.UsersService
}

func Init(authsrv ports.JWTService, usersrv ports.UsersService) *service {
	return &service{authsrv: authsrv, usersrv: usersrv}
}

func (srv *service) AuthorizeJWT(roles []string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken := c.Request.Header.Get("Authorization")
		if !strings.HasPrefix(jwtToken, "Bearer ") {
			c.AbortWithStatusJSON(401, gin.H{"message": apperrors.ErrUnauthorized})
			return
		}
		token, err := srv.authsrv.ValidateToken(strings.Split(jwtToken, "Bearer ")[1])
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

func (srv *service) ReturnJWT(c *gin.Context) {
	user, ok := c.MustGet("user").(domain.User)
	if !ok {
		c.AbortWithStatusJSON(500, gin.H{"message": apperrors.ErrInternal})
		return
	}
	accesstoken := srv.authsrv.GenerateAccessToken(user)
	refreshtoken := srv.authsrv.GenerateRefreshToken(user)
	c.SetCookie("refreshtoken", refreshtoken, int(time.Hour.Seconds()*24*3), "/", "", false, true)
	c.JSON(200, gin.H{"accesstoken": accesstoken})
}

func (srv *service) RefreshJWT(c *gin.Context) {
	refreshtokenCookie, err := c.Request.Cookie("refreshtoken")
	if err != nil {
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized)
		return
	}
	refreshtoken, err := srv.authsrv.ValidateToken(refreshtokenCookie.Value)
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
		ID:       objID,
		Username: claims["user"].(string),
		Role:     claims["role"].(string),
	}
	_, err = srv.usersrv.FetchUser(user.ID)
	if err != nil {
		c.AbortWithStatusJSON(404, apperrors.ErrNotFound)
		return
	}
	println(user.ID.String())
	accesstoken := srv.authsrv.GenerateAccessToken(user)
	c.JSON(200, gin.H{"accesstoken": accesstoken})
}

func (srv *service) RevokeJWT(c *gin.Context) {
	refreshtokenCookie, err := c.Request.Cookie("refreshtoken")
	if err != nil {
		c.AbortWithStatusJSON(401, apperrors.ErrUnauthorized)
		return
	}
	refreshtoken, err := srv.authsrv.ValidateToken(refreshtokenCookie.Value)
	if err != nil || !refreshtoken.Valid {
		c.AbortWithStatusJSON(401, gin.H{"message": "refresh token invalid"})
		return
	}
	claims := refreshtoken.Claims.(jwt.MapClaims)
	srv.authsrv.DeleteRefreshToken(claims["user_id"].(string))
	c.SetCookie("refreshtoken", "", -1, "/", "", false, true)
	c.AbortWithStatusJSON(200, gin.H{"message": "Token revoked"})
}
