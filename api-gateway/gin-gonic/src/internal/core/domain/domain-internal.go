package domain

import (
	"encoding/json"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// Event types
const (
	EVENT_TYPE_PARCELS          = "parcels"
	EVENT_TYPE_DAILY_WEATHER    = "daily_weather"
	EVENT_TYPE_FORECAST_WEATHER = "forecast_weather"
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

type AsyncEventExtReceive struct {
	ID           string          `json:"id,omitempty"`
	ErrorMessage string          `json:"errorMessage,omitempty"`
	Payload      json.RawMessage `json:"payload"`
}

type SyncEventExtReceive struct {
	ErrorMessage string          `json:"errorMessage,omitempty"`
	Payload      json.RawMessage `json:"payload"`
}

type AsyncEventExtSend struct {
	ID      string      `json:"id,omitempty"`
	Payload interface{} `json:"payload"`
}

type SyncEventExtSend struct {
	Payload interface{} `json:"payload"`
	Key     string      `json:"key"`
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

type APIKey struct {
	APIKey string `json:"apiKey"`
}

type EncrytedData struct {
	Data string `json:"data"`
}

// Misc

const (
	ENV_MODE_LOCAL = "local"
	ENV_MODE_DEV   = "dev"
	ENV_MODE_TEST  = "test"
	ENV_MODE_PROD  = "prod"
)

const (
	ROLE_ADMIN          = "admin"
	ROLE_PLAIN          = "user"
	ROLE_AGRARIAN       = "agrarian"
	ROLE_PRIVATE_ACCESS = "private_access"
)
