package handlers

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"

	"github.com/gin-gonic/gin"
)

type UsersHTTPHandler struct {
	usersService      ports.UsersService
	enclosuresService ports.EnclosuresService
}

func NewUsersHTTPHandler(usersService ports.UsersService, enclosuresService ports.EnclosuresService) *UsersHTTPHandler {
	return &UsersHTTPHandler{usersService: usersService, enclosuresService: enclosuresService}
}

// @Summary Authorize user
// @Description Authorize user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} domain.User
// @Failure 500 {object} string
// @Router /users/authorize [post]
func (hdl *UsersHTTPHandler) CheckLogin(c *gin.Context) {
	var user domain.User
	err := c.BindJSON(&user)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	user, err = hdl.usersService.CheckLogin(user.Email, user.Password)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.Set("user", user)
}

// @Summary Create new user
// @Description Create new user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 201 {object} string
// @Failure 500 {object} string
// @Router /users [post]
func (hdl *UsersHTTPHandler) CreateNewUser(c *gin.Context) {
	var user domain.User
	c.BindJSON(&user)
	err := hdl.usersService.PostNewUser(user)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(201, nil)
}

// @Summary Delete user
// @Description Delete user
// @Tags users
// @Accept  json
// @Produce  json
// @Success 204 {object} string
// @Failure 500 {object} string
// @Router /users/{id} [delete]
func (hdl *UsersHTTPHandler) DeleteUser(c *gin.Context) {
	id := c.Param("id")
	err := hdl.usersService.DeleteUser(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(204, nil)
}

// @Summary Fetch all users
// @Description Fetch all users
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} []domain.User
// @Failure 500 {object} string
// @Router /users [get]
func (hdl *UsersHTTPHandler) FetchAllUsers(c *gin.Context) {
	users, err := hdl.usersService.FetchAllUsers()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}
	c.JSON(200, users)
}

// @Summary Fetch enclosures by user id
// @Description Fetch enclosures by user id
// @Tags users
// @Accept  json
// @Produce  json
// @Success 200 {object} []domain.Enclosure
// @Failure 500 {object} string
// @Router /users/{id}/enclosures [get]
func (hdl *UsersHTTPHandler) FetchEnclosuresByUserId(c *gin.Context) {
	id := c.Param("id")
	user, err := hdl.usersService.FetchUser(id)
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
		return
	}

	if user.Role == domain.ROLE_ADMIN {
		enclosureIds, err := hdl.enclosuresService.FetchAllEnclosureIds()
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"message": err.Error()})
			return
		}
		c.JSON(200, enclosureIds)
		return
	}

	if user.EnclosureIds == nil {
		c.JSON(200, []string{})
		return
	}
	c.JSON(200, user.EnclosureIds)
}
