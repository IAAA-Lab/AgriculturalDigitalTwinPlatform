package domain

import (
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// Event types
const (
	EVENT_TYPE_PARCELS          = "parcels"
	EVENT_TYPE_DAILY_WEATHER    = "dailyWeather"
	EVENT_TYPE_FORECAST_WEATHER = "forecastWeather"
	EVENT_TYPE_NDVI             = "ndvi"
	EVENT_TYPE_NDVI_MAP         = "ndviMap"
)

// Events
type EventIn struct {
	ID        uuid.UUID     `json:"id,omitempty"`
	EventType string        `json:"eventType"`
	Channel   chan EventOut `json:"channel"`
	Payload   interface{}   `json:"payload"`
}

type EventExt struct {
	ID      string      `json:"_id,omitempty"`
	Payload interface{} `json:"payload"`
}

type EventOut struct {
	ErrorMessage string      `json:"errorMessage"`
	Payload      interface{} `json:"payload"`
}

// Security
type AuthCustomClaims struct {
	User_id string `json:"user_id"`
	User    string `json:"user"`
	Role    string `json:"role"`
	jwt.StandardClaims
}

type EncrytedData struct {
	Data string `bson:"data"`
}

// Misc

const (
	ENV_MODE_LOCAL = "local"
	ENV_MODE_DEV   = "dev"
	ENV_MODE_TEST  = "test"
	ENV_MODE_PROD  = "prod"
)

const (
	ROLE_ADMIN       = "admin"
	ROLE_NEWS_EDITOR = "newsEditor"
	ROLE_PLAIN       = "user"
	ROLE_AGRARIAN    = "agrarian"
)

var (
	AreaChar = Characteristics{
		Name: "Area",
		Unit: "m2",
	}
	SlopeAvgChar = Characteristics{
		Name: "Pendiente media",
		Unit: "%",
	}
	IrrigationCoefChar = Characteristics{
		Name: "Coef. de regadío",
		Unit: "%",
	}
	PlantsHealth = Characteristics{
		Name: "Salud plantas (NDVI)",
		Unit: "%",
	}
)

type StateNames string

const (
	Good   StateNames = "BIEN"
	Medium StateNames = "MEDIO"
	Bad    StateNames = "MAL"
)
