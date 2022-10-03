package usershdl

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type HTTPHandler struct {
	usersService ports.UsersService
}

func NewHTTPHandler(usersService ports.UsersService) *HTTPHandler {
	return &HTTPHandler{
		usersService: usersService,
	}
}

func (hdl *HTTPHandler) CheckLogin(c *gin.Context) {
	var user domain.User
	c.BindJSON(&user)
	user, err := hdl.usersService.CheckLogin(user.Username, user.Password)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Set("user", user)
}

func (hdl *HTTPHandler) CreateNewUser(c *gin.Context) {
	var user domain.User
	c.BindJSON(&user)
	err := hdl.usersService.PostNewUser(user)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, nil)
}

func (hdl *HTTPHandler) DeleteUser(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	err = hdl.usersService.DeleteUser(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(204, nil)
}

func (hdl *HTTPHandler) FetchAllUsers(c *gin.Context) {
	users, err := hdl.usersService.FetchAllUsers()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, users)
}

func (hdl *HTTPHandler) AuthorizeUser(c *gin.Context) {
	c.JSON(200, nil)
}
