package domain

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Password string             `json:"password"`
	Role     string             `json:"role"`
}
type UserNoPasswd struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id"`
	Username string             `json:"username"`
	Role     string             `json:"role"`
	Parcels  []ParcelRefs       `json:"parcels"`
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

type AuthCustomClaims struct {
	User_id string `json:"user_id"`
	User    string `json:"user"`
	Role    string `json:"role"`
	jwt.StandardClaims
}

type EncrytedData struct {
	Data string `bson:"data"`
}

// --------

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

// --------

type TeleAvgParams struct {
	Operation string `json:"operation" default:"getndviindexmeanvaluezone"`
	InitDate  string `json:"initdate"`
	EndDate   string `json:"enddate"`
	Id        string `json:"id"`
	Epsgcode  int    `json:"epsgCode"`
}

type TeleAvgResponse struct {
	Response []struct {
		NDVI map[string]float32
	} `json:"respuesta"`
}

type ParcelParams struct {
	Operation string   `json:"operation" default:"parcelascentroides"`
	Anno      string   `json:"anno"`
	Epsgcode  int      `json:"epsgCode" default:"4258"`
	Id        []string `json:"ids"`
}

type ParcelResponse struct {
	Response []parcelPayload `json:"features"`
}

type parcelPayload struct {
	Geometry struct {
		Coordinates [2]float32 `json:"coordinates"`
	} `json:"geometry"`
	Ids identifiers `json:"properties"`
}

type UserParcelParams struct {
	Operation string `json:"operation" default:"info"`
	Year      string `json:"year"`
	User      string `json:"user"`
	Ids       string `json:"ids"`
}

type UserParcelResponse struct {
	Response []userParcelPayload `json:"respuesta"`
}

type userParcelPayload struct {
	Identifiers     identifiers       `json:"identificadores"`
	Crops           []crops           `json:"Cultivos"`
	Fertilizers     []fertilizers     `json:"Fertilizantes"`
	Phytosanitaries []phytosanitaries `json:"Fitosanitarios"`
}

type identifiers struct {
	Province  int `json:"provincia"`
	County    int `json:"municipio"`
	Aggregate int `json:"agregado"`
	Zone      int `json:"zona"`
	Polygon   int `json:"poligono"`
	Parcel    int `json:"parcela"`
	// Enclosure int `json:"recinto"`
}

type crops struct {
	Name        string  `json:"Cultivo"`
	Variety     string  `json:"Variedad"`
	Production  float32 `json:"Produccion (Kg)"`
	Area        float32 `json:"Superficie (Ha)"`
	Performance float32 `json:"Rendimiento (Kg/Ha)"`
	Harvest     int8    `json:"Cosecha"`
}

type fertilizers struct {
	Name     string    `json:"Fertilizante"`
	Date     time.Time `json:"Fecha"`
	Quantity float32   `json:"Cantidad"`
}

type phytosanitaries struct {
	ActiveMatter string    `json:"MateriaActiva"`
	Product      string    `json:"ProductoFitosanitario"`
	Plague       string    `json:"Plaga"`
	StartDate    time.Time `json:"FechaInicio"`
	EndDate      time.Time `json:"FechaFin"`
}

type EnclosureParams struct {
	Operation string   `json:"operation" default:"recintos"`
	Ids       []string `json:"ids"`
	Anno      string   `json:"anno"`
	Epsgcode  int      `json:"epsgcode" default:"4258"`
}

type EnclosureResponse struct {
	Response []enclosurePayload `json:"features"`
}

type enclosurePayload struct {
	Geometry struct {
		Coordinates [1][][2]float32
	}
	Characteristics identifiersEnclosure `json:"properties"`
}

type identifiersEnclosure struct {
	Province       int     `json:"provincia"`
	County         int     `json:"municipio"`
	Aggregate      int     `json:"agregado"`
	Zone           int     `json:"zona"`
	Polygon        int     `json:"poligono"`
	Parcel         int     `json:"parcela"`
	Enclosure      int     `json:"recinto"`
	Area           float32 `json:"superficie"`
	SlopeAvg       float32 `json:"pendiente_media"`
	IrrigationCoef float32 `json:"coef_regadio"`
}

// ----- BBDD -----
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
