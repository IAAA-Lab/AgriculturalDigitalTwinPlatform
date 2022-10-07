package domain

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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

type AuthCustomClaims struct {
	User_id string `json:"user_id"`
	User    string `json:"user"`
	Role    string `json:"role"`
	jwt.StandardClaims
}

type EncrytedData struct {
	Data string `bson:"data"`
}

const (
	Admin      = "admin"
	NewsEditor = "newsEditor"
	Plain      = "user"
	Agrarian   = "agrarian"
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

// --- Database models ---

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Password string             `json:"password"`
	Role     string             `json:"role"`
}

type ParcelRefs struct {
	Id         string `json:"id"`
	Enclosures struct {
		Ids []string `json:"ids"`
	} `json:"enclosures"`
}

type News struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title             string             `bson:"title" json:"title"`
	LittleDescription string             `bson:"little_description" json:"subtitle"`
	Author            string             `bson:"author" json:"author"`
	Date              primitive.DateTime `bson:"date" json:"date"`
	ReadMin           uint8              `bson:"read_min" json:"readTime"`
	Image             string             `bson:"image" json:"thumbnail"`
	Content           string             `bson:"content,omitempty" json:"content,omitempty"`
}

type Parcel struct {
	Ts       time.Time `json:"ts"`
	Id       string    `json:"id"`
	Historic struct {
		Ts   time.Time `json:"ts"`
		Info struct {
			Coordinates Coordinates `json:"coordinates"`
		} `json:"info"`
		Enclosures []Enclosure `json:"enclosures"`
	} `json:"historic"`
}

type Enclosure struct {
	Id       string        `json:"id"`
	ImageUri string        `json:"imageUri"`
	Info     EnclosureInfo `json:"info"`
}

type EnclosureInfo struct {
	Ts              time.Time         `json:"ts"`
	Characteristics []Characteristics `json:"characteristics"`
	Coordinates     []Coordinates     `json:"coordinates"`
	NDVI            NDVI              `json:"ndvi"`
	Crops           []struct {
		Name            string            `json:"name"`
		Variety         string            `json:"variety"`
		ImageUri        string            `json:"imageUri" bson:"imageUri"`
		Characteristics []Characteristics `json:"characteristics"`
	} `json:"crops"`
	Fertilizers []struct {
		Name      string    `json:"name"`
		StartDate time.Time `json:"startDate"`
		Quantity  float32   `json:"quantity"`
	} `json:"fertilizers"`
	Phytosanitaries []struct {
		ActiveMatter string    `json:"activeMatter"`
		Product      string    `json:"product"`
		Plague       string    `json:"plague"`
		StartDate    time.Time `json:"startDate"`
		EndDate      time.Time `json:"endDate"`
	} `json:"phytosanitaries"`
}

type CropsInfo struct {
	Production  float32 `json:"production" bson:",truncate"`
	Area        float32 `json:"area" bson:",truncate"`
	Performance float32 `json:"performance" bson:",truncate"`
	Harvest     int8    `json:"harvest"`
}

type Characteristics struct {
	Name  string     `json:"name"`
	Value float32    `json:"value" bson:",truncate"`
	Unit  string     `json:"unit,omitempty" bson:"unit,omitempty"`
	State StateNames `json:"state"`
}

type Coordinates struct {
	Lat float32 `json:"lat"`
	Lng float32 `json:"lng"`
}

type NDVI struct {
	Avg float32 `json:"avg"`
	// All []float32 `json:"all"`
}
