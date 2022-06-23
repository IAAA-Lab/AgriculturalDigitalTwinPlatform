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
	authsrv "prakticas/backend-gpsoft/src/internal/core/services/auth-srv"
	cachesrv "prakticas/backend-gpsoft/src/internal/core/services/cache-srv"
	encryptionsrv "prakticas/backend-gpsoft/src/internal/core/services/encryption-srv"
	newssrv "prakticas/backend-gpsoft/src/internal/core/services/news-srv"
	userssrv "prakticas/backend-gpsoft/src/internal/core/services/users-srv"
	cacherepo "prakticas/backend-gpsoft/src/internal/dataSources/cache-repo"
	encryptionrepo "prakticas/backend-gpsoft/src/internal/dataSources/encryption-repo"
	newsrepo "prakticas/backend-gpsoft/src/internal/dataSources/news-repo"
	usersrepo "prakticas/backend-gpsoft/src/internal/dataSources/users-repo"
	newshdl "prakticas/backend-gpsoft/src/internal/handlers/news-hdl"
	usershdl "prakticas/backend-gpsoft/src/internal/handlers/users-hdl"
	encryptionmw "prakticas/backend-gpsoft/src/middleware/encryption-mw"
	jwtmw "prakticas/backend-gpsoft/src/middleware/jwt-mw"
)

func CorsConfig() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("CLIENT_URI"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE")
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
	redisUri := os.Getenv("REDIS_URI")
	encKey := os.Getenv("KEY_DECRYPT_PASSWD")
	ivKey := os.Getenv("IV_BLOCK_PASSWD")

	encryptionrepository := encryptionrepo.NewEncrypter(encKey, ivKey)
	encryptionService := encryptionsrv.New(encryptionrepository)
	encryptionMiddleware := encryptionmw.Init(encryptionService)

	newsrepository := newsrepo.NewMongodbConn(mongoUri, mongoDb, 15)
	newsService := newssrv.New(newsrepository)
	newsHandler := newshdl.NewHTTPHandler(newsService)

	usersrespository := usersrepo.NewMongodbConn(mongoUri, mongoDb, 15)
	usersService := userssrv.New(usersrespository)
	usersHandler := usershdl.NewHTTPHandler(usersService)

	cacherepository := cacherepo.NewRedisConn(redisUri)
	cacheService := cachesrv.New(cacherepository)
	authService := authsrv.JWTAuthService(cacheService)
	authMiddleware := jwtmw.Init(authService, usersService)

	r := gin.Default()
	r.Use(CorsConfig())
	var xssMdlwr xss.XssMw
	r.Use(xssMdlwr.RemoveXss())

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	// v1 := r.Group("/")
	// {
	// 	authGroup := v1.Group("/auth")
	// 	{
	// 		authGroup.POST("/login", usersHandler.CheckLogin, authMiddleware.ReturnJWT)
	// 		authGroup.POST("/logout", authMiddleware.RevokeJWT)
	// 		authGroup.POST("/refresh", authMiddleware.RefreshJWT)
	// 	}
	// 	usersGroup := v1.Group("/users").Use(authMiddleware.AuthorizeJWT([]string{domain.Admin}))
	// 	{
	// 		usersGroup.POST("/users", usersHandler.CreateNewUser)
	// 		usersGroup.GET("/users", usersHandler.FetchAllUsers)
	// 		usersGroup.DELETE("/users/:id", usersHandler.DeleteUser)
	// 	}
	// 	newsGroup := v1.Group("/news")
	// 	{
	// 		newsGroup.GET("/", newsHandler.Get)
	// 		newsGroup.POST("/", authMiddleware.AuthorizeJWT([]string{domain.Admin, domain.NewsEditor}), newsHandler.PostNewNews)
	// 		newsGroup.GET("/:id", newsHandler.GetDesc)
	// 		newsGroup.GET("/news/number", newsHandler.GetNumber)
	// 	}
	// 	agrarianGroup := v1.Group("/agrarian").Use(authMiddleware.AuthorizeJWT([]string{domain.Admin, domain.Agrarian}))
	// 	{
	// 		areas := agrarianGroup.Group("/areas")
	// 		{
	// 			areas.GET("/areas", agrarianHandler.GetAreasByUser)
	// 		}
	// 		fields := agrarianGroup.Group("/fields")
	// 		{

	// 		}
	// 		singleField := agrarianGroup.Group("/singleField")
	// 		{

	// 		}
	// 	}
	// }
	r.POST("/auth/login", encryptionMiddleware.DecryptData, usersHandler.CheckLogin, authMiddleware.ReturnJWT)
	r.POST("/auth/logout", authMiddleware.RevokeJWT)
	r.POST("/auth/refresh", authMiddleware.RefreshJWT)
	r.POST("/users", authMiddleware.AuthorizeJWT([]string{domain.Admin}), encryptionMiddleware.DecryptData, usersHandler.CreateNewUser)
	r.GET("/users", authMiddleware.AuthorizeJWT([]string{domain.Admin}), usersHandler.FetchAllUsers)
	r.DELETE("/users/:id", authMiddleware.AuthorizeJWT([]string{domain.Admin}), usersHandler.DeleteUser)
	r.GET("/news/number", newsHandler.GetNumber)
	r.GET("/news", newsHandler.Get)
	r.POST("/news", authMiddleware.AuthorizeJWT([]string{domain.Admin, domain.NewsEditor}), newsHandler.PostNewNews)
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
