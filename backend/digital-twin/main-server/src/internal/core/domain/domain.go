package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// --- Database models ---

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

type User struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
	Role     string             `json:"role"`
}

type UserParcels struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	UserID       primitive.ObjectID `json:"userId"`
	Ts           time.Time          `json:"ts"`
	EnclosureIds []string           `json:"enclosureIds"`
	Summary      Summary            `json:"summary"`
}

type SummaryStat struct {
	EnclosureId string          `json:"enclosureId"`
	Stat        Characteristics `json:"stat"`
	CropIds     []CropId        `json:"cropIds"`
}

type Summary struct {
	//FIX: complete in the future...
	Stats []SummaryStat `json:"stats"`
}

type Characteristics struct {
	Name  string     `json:"name"`
	Value float32    `json:"value" bson:"value,truncate"`
	Unit  string     `json:"unit,omitempty" bson:"unit,omitempty"`
	State StateNames `json:"state"`
}

type Parcel struct {
	Id       string    `json:"id"`
	Ts       time.Time `json:"ts"`
	Type     string    `json:"type"`
	Geometry struct {
		Type        string    `json:"type"`
		Coordinates []float64 `json:"coordinates"`
	} `json:"geometry"`
	Properties struct {
		Address struct {
			ZIP          string `json:"zip"`
			Municipality string `json:"municipality"`
			Province     string `json:"province"`
			CCAA         string `json:"ccaa"`
		} `json:"address"`
		Idema          string `json:"idema"`
		ProtectedZones []struct {
			Type  string   `json:"type"`
			Zones []string `json:"zones"`
		} `json:"protectedZones"`
	} `json:"properties"`
	Enclosures struct {
		Type     string      `json:"type"`
		Features []Enclosure `json:"enclosures"`
	} `json:"enclosures"`
}

type Enclosure struct {
	Id       string    `json:"id"`
	Ts       time.Time `json:"ts"`
	Type     string    `json:"type"`
	Geometry struct {
		Type        string      `json:"type"`
		Coordinates [][]float64 `json:"coordinates"`
	} `json:"geometry"`
	Properties struct {
		ImageUri        string            `json:"imageUri"`
		ProtectedArea   bool              `json:"protectedArea"`
		Characteristics []Characteristics `json:"characteristics"`
		//UsedArea float64 `json:"usedArea"`
		IrrigationType string `json:"irrigationType"`
		UseType        string `json:"useType"`
	} `json:"properties"`
	Crops []Crop `json:"crops"`
}

type Crop struct {
	Name            string            `json:"name"`
	Variety         string            `json:"variety"`
	ImageUri        string            `json:"imageUri" bson:"imageUri"`
	Production      float32           `json:"production" bson:",truncate"`
	Area            float32           `json:"area" bson:",truncate"`
	Performance     float32           `json:"performance" bson:",truncate"`
	Harvest         int8              `json:"harvest"`
	Characteristics []Characteristics `json:"characteristics"`
}

type CropId struct {
	Name    string `json:"name"`
	Variety string `json:"variety"`
}

type Fertilizer struct {
	EnclosureId string    `json:"enclosureId"`
	CropId      CropId    `json:"crop"`
	Name        string    `json:"name"`
	StartDate   time.Time `json:"startDate"`
	Quantity    float32   `json:"quantity"`
}

type Phytosanitary struct {
	EnclosureId        string    `json:"enclosureId"`
	CropId             CropId    `json:"crop"`
	StartDate          time.Time `json:"startDate"`
	EndDate            time.Time `json:"endDate"`
	Product            string    `json:"product"`
	RegistrationNumber string    `json:"registrationNumber"`
	Plague             string    `json:"plague"`
	Area               float32   `json:"area"`
	Dosage             float32   `json:"dosage"`
	Efficacy           float32   `json:"efficacy"`
	Hap                struct {
		Id                 string    `json:"id"`
		Description        string    `json:"description"`
		ROMACode           string    `json:"romaCode"`
		AdquisitionDate    time.Time `json:"adquisitionDate"`
		LastInspectionDate time.Time `json:"lastInspectionDate"`
	} `json:"hap"`
	Had struct {
		Id         string `json:"id"`
		Name       string `json:"name"`
		NifCode    string `json:"nifCode"`
		ROPOCode   string `json:"ropoCode"`
		CarnetType string `json:"carnetType"`
	} `json:"had"`
}

type CropStats struct {
	Date        time.Time         `json:"date"`
	EnclosureId string            `json:"enclosureId"`
	CropId      CropId            `json:"cropId"`
	Stats       []Characteristics `json:"stats"`
}

type NDVI struct {
	EnclosureId string    `json:"enclosureId"`
	Date        time.Time `json:"date"`
	Value       float32   `json:"value"`
}

type NDVIMap struct {
	Type     string    `json:"type"`
	Date     time.Time `json:"date"`
	ImageUri string    `json:"imageUri"`
}

type FarmHolder struct {
	Name    string       `json:"name"`
	Id      FarmHolderId `json:"id"`
	Address struct {
		ZIP          string `json:"zip"`
		Municipality string `json:"municipality"`
		Province     string `json:"province"`
		CCAA         string `json:"ccaa"`
	} `json:"address"`
	Phones []string `json:"phones"`
	Email  string   `json:"email"`
}

type FarmHolderId struct {
	Type string `json:"type"`
	Code string `json:"code"`
}
type ForecastWeather struct {
	Type     string    `json:"type"`
	ParcelId string    `json:"parcelId"`
	Idema    string    `json:"idema"`
	Fint     time.Time `json:"fint"`
	Prec     float32   `json:"prec"`
	Tamin    float32   `json:"tamin"`
	Tamax    float32   `json:"tamax"`
	Ta       float32   `json:"ta"`
	Hr       float32   `json:"hr"`
	Tpr      float32   `json:"tpr"`
}

type DailyWeather struct {
	Type       string    `json:"type"`
	ParcelId   string    `json:"parcelId"`
	Date       time.Time `json:"date"`
	DataOrigin struct {
		Producer  string `json:"producer"`
		Web       string `json:"web"`
		Copyrigth string `json:"copyrigth"`
		LegalNote string `json:"legalNote"`
	} `json:"dataOrigin"`
	Prediction struct {
		SkyState  []weatherState
		Prec      []weatherState
		ProbPrec  []weatherState
		Snow      []weatherState
		ProbSnow  []weatherState
		ProbStorm []weatherState
		Ta        []weatherState
		Hr        []weatherState
		Wind      []weatherState
	} `json:"prediction"`
}

type weatherState struct {
	Hour  int8    `json:"hour"`
	Value float32 `json:"value"`
}

type SensorData struct {
	EnclosureId string          `json:"enclosureId"`
	SensorId    string          `json:"sensorId"`
	SensorType  string          `json:"sensorType"`
	Date        time.Time       `json:"date"`
	Stat        Characteristics `json:"stat"`
}

type Notification struct {
	Ts                  time.Time `json:"ts"`
	AvatarUri           string    `json:"avatarUri"`
	Title               string    `json:"title"`
	Content             string    `json:"content"`
	AffectedEnclosureId string    `json:"affectedEnclosureId"`
}
