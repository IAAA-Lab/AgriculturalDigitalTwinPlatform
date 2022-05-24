package main

// @title Swagger Example API
// @version 1.0
// @description This is a sample server celler server.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

import (
	"log"
	"os"

	"github.com/dvwright/xss-mw"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/swaggo/gin-swagger/swaggerFiles"

	// docs is generated by Swag CLI, you have to import it.

	"prakticas/backend-gpsoft/docs"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	newssrv "prakticas/backend-gpsoft/src/internal/core/services/news-srv"
	userssrv "prakticas/backend-gpsoft/src/internal/core/services/users-srv"
	newsrepo "prakticas/backend-gpsoft/src/internal/dataSources/news-repo"
	usersrepo "prakticas/backend-gpsoft/src/internal/dataSources/users-repo"
	newshdl "prakticas/backend-gpsoft/src/internal/handlers/news-hdl"
	usershdl "prakticas/backend-gpsoft/src/internal/handlers/users-hdl"
	"prakticas/backend-gpsoft/src/middleware"
)

func CorsConfig() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func setupRouter() *gin.Engine {

	mongoUri := os.Getenv("MONGO_URI")
	mongoDb := os.Getenv("MONGO_DB")

	newsrepository := newsrepo.NewMongodbConn(mongoUri, mongoDb, 15)
	newsService := newssrv.New(newsrepository)
	newsHandler := newshdl.NewHTTPHandler(newsService)

	usersrespository := usersrepo.NewMongodbConn(mongoUri, mongoDb, 15)
	usersService := userssrv.New(usersrespository)
	usersHandler := usershdl.NewHTTPHandler(usersService)

	r := gin.Default()
	r.Use(CorsConfig())
	var xssMdlwr xss.XssMw
	r.Use(xssMdlwr.RemoveXss())
	// @Success 200 {string} string	"ok"
	// @failure 400 {string} string	"error"
	// @response default {string} string	"other error"
	// @Header 200 {string} Location "/entity/1"
	// @Header 200,400,default {string} Token "token"
	// @Header all {string} Token2 "token2"
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	r.POST("/login", usersHandler.CheckLogin)
	r.POST("/users", middleware.AuthorizeJWT([]string{domain.Admin}), usersHandler.CreateNewUser)
	r.GET("/users", middleware.AuthorizeJWT([]string{domain.Admin}), usersHandler.FetchAllUsers)
	r.DELETE("/users/:id", middleware.AuthorizeJWT([]string{domain.Admin}), usersHandler.DeleteUser)
	r.GET("/news/number", newsHandler.GetNumber)
	r.GET("/news", newsHandler.Get)
	r.POST("/news", middleware.AuthorizeJWT([]string{domain.Admin, domain.Editor}), newsHandler.PostNewNews)
	r.GET("/news/:id", newsHandler.GetDesc)

	return r
}

func setUpEnv() {
	err := error(nil)
	switch os.Getenv("ENV_MODE") {
	case "DOCKER":
		return
	case "PROD":
		err = godotenv.Load("../../../secrets/.env.production")
	case "DEV":
		err = godotenv.Load("../../../secrets/.env.development")
	default:
		err = godotenv.Load("../../../secrets/.env.local")
	}
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {

	setUpEnv()

	docs.SwaggerInfo.Title = "Agrarian exploitation Swagger API"
	docs.SwaggerInfo.Description = "This is an agrarian exploitation server."
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "agrarian.swagger.io"
	docs.SwaggerInfo.BasePath = "/v2"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	r := setupRouter()
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
