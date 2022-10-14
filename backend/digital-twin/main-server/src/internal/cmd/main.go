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
	"digital-twin/main-server/docs"
	eventhdl "digital-twin/main-server/src/internal/adapters/primary/event-handler"
	imageshdl "digital-twin/main-server/src/internal/adapters/primary/rest-api/images-hdl"
	encryptionmw "digital-twin/main-server/src/internal/adapters/primary/rest-api/middleware/encryption-mw"
	jwtmw "digital-twin/main-server/src/internal/adapters/primary/rest-api/middleware/jwt-mw"
	newshdl "digital-twin/main-server/src/internal/adapters/primary/rest-api/news-hdl"
	parcelshdl "digital-twin/main-server/src/internal/adapters/primary/rest-api/parcels-hdl"
	usershdl "digital-twin/main-server/src/internal/adapters/primary/rest-api/users-hdl"
	aes256repo "digital-twin/main-server/src/internal/adapters/secondary/aes-256"
	localfilestoragerepo "digital-twin/main-server/src/internal/adapters/secondary/local-file-storage"
	mongodb "digital-twin/main-server/src/internal/adapters/secondary/mongodb"
	rabbitmqrepo "digital-twin/main-server/src/internal/adapters/secondary/rabbitmq"
	redisrepo "digital-twin/main-server/src/internal/adapters/secondary/redis"
	"digital-twin/main-server/src/internal/core/domain"
	authsrv "digital-twin/main-server/src/internal/core/services/auth-srv"
	cachesrv "digital-twin/main-server/src/internal/core/services/cache-srv"
	encryptionsrv "digital-twin/main-server/src/internal/core/services/encryption-srv"
	imagessrv "digital-twin/main-server/src/internal/core/services/image-srv"
	newssrv "digital-twin/main-server/src/internal/core/services/news-srv"
	parcelssrv "digital-twin/main-server/src/internal/core/services/parcels-srv"
	userssrv "digital-twin/main-server/src/internal/core/services/users-srv"

	"log"
	"os"
	"time"

	cache "github.com/chenyahui/gin-cache"
	"github.com/chenyahui/gin-cache/persist"
	"github.com/dvwright/xss-mw"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/penglongli/gin-metrics/ginmetrics"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func CorsConfig() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("CLIENT_URI"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func setUpMonitoring(r *gin.Engine) *gin.Engine {
	m := gin.Default()
	metrics := ginmetrics.GetMonitor()
	metrics.UseWithoutExposingEndpoint(r)
	metrics.Expose(m)
	return m
}

func setupRouter() *gin.Engine {

	mongoUri := os.Getenv("MONGO_URI")
	rabbitMQURI := os.Getenv("RABBITMQ_URI")
	mongoDb := os.Getenv("MONGO_DB")
	redisUri := os.Getenv("REDIS_URI")
	encKey := os.Getenv("KEY_DECRYPT_PASSWD")
	ivKey := os.Getenv("IV_BLOCK_PASSWD")

	encryptionrepository := aes256repo.NewEncrypter(encKey, ivKey)
	encryptionService := encryptionsrv.New(encryptionrepository)
	encryptionMiddleware := encryptionmw.Init(encryptionService)

	mongodbRepository := mongodb.NewMongodbConn(mongoUri, mongoDb, 10)

	newsService := newssrv.New(mongodbRepository)
	newsHandler := newshdl.NewHTTPHandler(newsService)

	usersService := userssrv.New(mongodbRepository)
	usersHandler := usershdl.NewHTTPHandler(usersService)

	parcelsService := parcelssrv.New(mongodbRepository)
	parcelsHandler := parcelshdl.NewHTTPHandler(parcelsService)

	imagesRepository := localfilestoragerepo.NewLocalFileStorage("./images")
	imagesService := imagessrv.New(imagesRepository)
	imagesHandler := imageshdl.NewHTTPHandler(imagesService)

	cacherepository := redisrepo.NewRedisConn(redisUri)
	cacheService := cachesrv.New(cacherepository)
	authService := authsrv.JWTAuthService(cacheService)
	authMiddleware := jwtmw.Init(authService, usersService, os.Getenv("ENV_MODE"))

	messageBrokerRepository := rabbitmqrepo.NewRabbitMQConn(rabbitMQURI)

	cacheMiddleware := cache.CacheByRequestURI(persist.NewRedisStore(cacherepository.GetClient()), 10*time.Minute)

	//Start event handler
	eventHandler := eventhdl.NewEventHandler(parcelsService, cacheService, messageBrokerRepository)
	eventHandler.Start()

	parcelsStreamingHandler := parcelshdl.NewHTTPStreamHandler(parcelsService, eventHandler.GetIntChannel())

	r := gin.Default()
	m := ginmetrics.GetMonitor()
	m.SetMetricPath("/metrics")
	m.Use(r)
	r.SetTrustedProxies([]string{"localhost"})
	r.Use(CorsConfig())
	var xssMdlwr xss.XssMw
	r.Use(xssMdlwr.RemoveXss())

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	// ---- Image storage
	r.Static("/images", "./images")
	r.POST("/images/upload", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_NEWS_EDITOR}), imagesHandler.UploadImage)

	// ---- Auth
	r.POST("/auth/login", encryptionMiddleware.DecryptData, usersHandler.CheckLogin, authMiddleware.ReturnJWT)
	r.POST("/auth/logout", authMiddleware.RevokeJWT)
	r.POST("/auth/refresh", authMiddleware.RefreshJWT)
	r.POST("/auth/validate", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_AGRARIAN, domain.ROLE_NEWS_EDITOR}), usersHandler.AuthorizeUser)
	// ---- Users
	usersGroup := r.Group("/users", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN}))
	{
		usersGroup.POST("/", encryptionMiddleware.DecryptData, usersHandler.CreateNewUser)
		usersGroup.GET("/", usersHandler.FetchAllUsers)
		usersGroup.DELETE("/:id", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN}), usersHandler.DeleteUser)
	}
	// ---- News
	newsGroup := r.Group("/news", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_NEWS_EDITOR}))

	r.GET("/news/number", cacheMiddleware, newsHandler.GetNumber)
	r.GET("/news", cacheMiddleware, newsHandler.Get)
	r.GET("/news/:id", cacheMiddleware, newsHandler.GetDesc)

	newsGroup.POST("/", newsHandler.PostNews)
	newsGroup.PATCH("/:id", newsHandler.UpdateNews)
	newsGroup.DELETE("/:id", newsHandler.DeleteNews)
	// ---- Agrarian
	// ---- SSE (inject eventhandler channel for communication)
	agrarianGroup := r.Group("/", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_AGRARIAN}))

	r.GET("/parcels/refs", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN}), parcelsHandler.GetUserParcels)
	r.PATCH("/parcels/refs", authMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN}), parcelsHandler.PostParcelRefs)

	agrarianGroup.GET("/parcels/summary", parcelsHandler.GetParcelsSummary)
	agrarianGroup.GET("/sse/weather/daily", parcelsStreamingHandler.GetDailyWeather)
	agrarianGroup.GET("/sse/weather/forecast", parcelsStreamingHandler.GetForecastWeather)
	agrarianGroup.GET("/sse/weather/tempMap", parcelsStreamingHandler.GetWeatherTempMap)
	agrarianGroup.GET("/enclosures", parcelsHandler.GetEnclosures)
	agrarianGroup.GET("/cropStats", parcelsHandler.GetCropStats)
	agrarianGroup.GET("/sse/ndvi", parcelsStreamingHandler.GetNDVI)
	agrarianGroup.GET("/sse/ndvi/map", parcelsStreamingHandler.GetNDVIMap)
	agrarianGroup.GET("/phytosantaries", parcelsHandler.GetPhytosanitaries)
	agrarianGroup.GET("/fertilizers", parcelsHandler.GetFertilizers)
	// agrarianGroup.GET("/ssetest", parcelsStreamingHandler.SseTest)
	//TODO: add digital twin routes

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
	m := setUpMonitoring(r)
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}
	go func() {
		_ = m.Run(":9090")
	}()
	r.Run(":" + port)
}
