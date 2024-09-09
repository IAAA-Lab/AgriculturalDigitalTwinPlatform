package main

import (
	"digital-twin/main-server/docs"
	"digital-twin/main-server/src/internal/adapters/primary/web/rest-api/handlers"
	"digital-twin/main-server/src/internal/adapters/primary/web/rest-api/middleware"
	weebhooks "digital-twin/main-server/src/internal/adapters/primary/web/rest-api/webhooks"
	"digital-twin/main-server/src/internal/adapters/secondary/minio"
	"digital-twin/main-server/src/internal/adapters/secondary/mongodb"
	"digital-twin/main-server/src/internal/adapters/secondary/redis"
	"digital-twin/main-server/src/internal/adapters/secondary/temporal"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/services"

	"os"

	"github.com/gin-gonic/gin"
	"github.com/penglongli/gin-metrics/ginmetrics"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func CorsConfig() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", os.Getenv("FRONTEND_URL"))
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, Origin, Cache-Control, X-Requested-With, Sec-WebSocket-Protocol, Sec-WebSocket-Version, Sec-WebSocket-Extensions")
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
	redisUri := os.Getenv("REDIS_URI")
	redisUsername := os.Getenv("REDIS_USERNAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	encKey := os.Getenv("KEY_DECRYPT_PASSWD")
	ivKey := os.Getenv("IV_BLOCK_PASSWD")
	minioEndpoint := os.Getenv("MINIO_ENDPOINT")
	minioAccessKey := os.Getenv("MINIO_ACCESS_KEY")
	minioSecretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	temporalEndpoint := os.Getenv("TEMPORAL_ENDPOINT")

	cacherepository := redis.NewRedisConn(redisUri, redisUsername, redisPassword)
	mongodbRepository := mongodb.NewMongodbConn(mongoUri, 10)
	minioRepository := minio.NewMinioConn(minioEndpoint, minioAccessKey, minioSecretAccessKey, false)
	// rabbitMQRepository := rabbitmq.NewRabbitMQConn(rabbitMQURI)
	temporalRepository := temporal.NewTemporalConn(temporalEndpoint)

	authService := services.NewAuthService(cacherepository)
	usersService := services.NewUsersService(mongodbRepository)
	digitalTwinsService := services.NewDigitalTwinsService(mongodbRepository, temporalRepository)
	fileDumpService := services.NewFileDumpService(minioRepository)

	encryptionMiddleware := middleware.InitEncryptionMiddleware(ivKey, encKey)
	JWTMiddleware := middleware.InitJwtMiddleware(authService, usersService, os.Getenv("ENV_MODE"))

	usersHandler := handlers.NewUsersHTTPHandler(usersService, digitalTwinsService)
	enclosuresHandler := handlers.NewDigitalTwinsHTTPHandler(digitalTwinsService)
	filesHandler := handlers.NewFilesHTTPHandler(fileDumpService)
	temporalWeebhookHandler := weebhooks.NewHTTPWebhookHandler(digitalTwinsService)

	r := gin.Default()
	m := ginmetrics.GetMonitor()
	m.SetMetricPath("/metrics")
	m.Use(r)
	r.SetTrustedProxies([]string{"localhost"})
	r.Use(CorsConfig())
	// var xssMdlwr xss.XssMw
	// r.Use(xssMdlwr.RemoveXss())

	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	// ---- Auth
	authGroup := r.Group("/auth")

	authGroup.POST("/login", encryptionMiddleware.DecryptData, usersHandler.CheckLogin, JWTMiddleware.ReturnJWT)
	authGroup.POST("/logout", JWTMiddleware.RevokeJWT)
	authGroup.POST("/refresh", JWTMiddleware.RefreshJWT)
	authGroup.GET("/validate", JWTMiddleware.ReturnJWT)

	// ---- Users
	usersGroup := r.Group("/", JWTMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN}))

	usersGroup.POST("/users", encryptionMiddleware.DecryptData, usersHandler.CreateNewUser)
	usersGroup.GET("/users", usersHandler.FetchAllUsers)
	usersGroup.DELETE("/users/:id", usersHandler.DeleteUser)
	r.GET("/users/:id/enclosures", JWTMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_AGRARIAN}), usersHandler.FetchEnclosuresByUserId)

	// ---- Digital twin
	agrarianGroup := r.Group("/", JWTMiddleware.AuthorizeJWT([]string{domain.ROLE_ADMIN, domain.ROLE_AGRARIAN}))

	agrarianGroup.GET("/weather/daily", enclosuresHandler.GetDailyWeather)
	agrarianGroup.GET("/weather/forecast", enclosuresHandler.GetForecastWeather)
	agrarianGroup.GET("/weather/historical", enclosuresHandler.GetHistoricalWeather)
	agrarianGroup.POST("/enclosures", enclosuresHandler.GetDigitalTwins)
	agrarianGroup.POST("/enclosures/new", enclosuresHandler.CreateNewDigitalTwin)
	agrarianGroup.GET("/enclosures/:id/neighbours", enclosuresHandler.GetDigitalTwinsInRadius)
	agrarianGroup.POST("/ndvi", enclosuresHandler.GetNDVI)
	agrarianGroup.POST("/activities", enclosuresHandler.GetActivities)

	agrarianGroup.POST("/enclosures/:id/predictions", enclosuresHandler.GetPrediction)

	agrarianGroup.POST("/enclosures/:id/files/activities", filesHandler.UploadActivitiesFiles)
	agrarianGroup.POST("/enclosures/:id/files/yield", filesHandler.UploadYieldFiles)

	agrarianGroup.POST("/enclosures/:id/simulations/start", enclosuresHandler.StartSimulation)
	// agrarianGroup.POST("/enclosures/:id/simulations/resume", enclosuresHandler.ResumeSimulation)
	agrarianGroup.POST("/enclosures/:id/simulations/stop", enclosuresHandler.StopSimulation)
	agrarianGroup.POST("/enclosures/:id/simulations/speed", enclosuresHandler.SimulationSpeed)
	agrarianGroup.GET("/enclosures/:id/simulations", enclosuresHandler.GetSimulations)
	agrarianGroup.DELETE("/enclosures/:id/simulations/:simulationId", enclosuresHandler.DeleteSimulation)
	r.GET("/enclosures/simulations/status/ws", enclosuresHandler.GetSimulationStatus)
	r.GET("/enclosures/:id/sensor-stream", enclosuresHandler.GetSensorStreamData)
	r.GET("/enclosures/:id/notifications", enclosuresHandler.GetNotifications)

	// For large file upload (default is 32 MB)
	// r.MaxMultipartMemory = 8 << 20

	// ---- Temporal webhook
	r.POST("/temporal-webhook/landing", temporalWeebhookHandler.HandleWebhookLanding)
	r.POST("/temporal-webhook/trusted", temporalWeebhookHandler.HandleWebhookTrusted)
	r.POST("/temporal-webhook/notifications", temporalWeebhookHandler.HandleWebhookNotifications)

	return r
}

func setUpSwagger(r *gin.Engine) {
	docs.SwaggerInfo.Title = "Gin gonic Swagger API"
	docs.SwaggerInfo.Description = "Gin gonic API Gateway"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "agrarian.swagger.io"
	docs.SwaggerInfo.BasePath = "/v2"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// To access swagger UI, go to http://localhost:8080/swagger/index.html
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func main() {

	r := setupRouter()
	setUpSwagger(r)
	m := setUpMonitoring(r)

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}
	go func() {
		_ = m.Run(":9093")
	}()
	r.Run(":" + port)
}
