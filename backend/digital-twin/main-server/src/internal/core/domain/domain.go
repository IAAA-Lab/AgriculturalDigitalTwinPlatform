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
	Diff        Characteristics `json:"diff"`
}

type Summary struct {
	//FIX: complete in the future...
	Stats struct {
		All  []SummaryStat `json:"all"`
		Bad  []SummaryStat `json:"bad"`
		Good []SummaryStat `json:"good"`
	} `json:"stats"`
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

type HistoricalWeather struct {
	Type        string    `json:"type" default:"historicalWeather"`
	ParcelId    string    `json:"parcelId"`
	Idema       string    `json:"idema"`
	Fint        time.Time `json:"fint"`
	Prec        float32   `json:"prec"`
	Tamin       float32   `json:"tamin"`
	Tamax       float32   `json:"tamax"`
	Tmed        float32   `json:"tmed"`
	TaminTime   time.Time `json:"taminTime"`
	TamaxTime   time.Time `json:"tamaxTime"`
	WindSpeed   float32   `json:"windSpeed"`
	WindDir     float32   `json:"windDir"`
	WindGust    float32   `json:"windGust"`
	WinGustTime time.Time `json:"windGustTime"`
}

type DailyWeather struct {
	Type         string `json:"type"`
	ParcelId     string `json:"parcelId"`
	Municipality string `json:"municipality"`
	Province     string `json:"province"`
	DataOrigin   struct {
		Producer  string `json:"producer"`
		Web       string `json:"web"`
		Copyright string `json:"copyright"`
		LegalNote string `json:"legalNote"`
		Language  string `json:"language"`
	} `json:"dataOrigin"`
	Prediction struct {
		Day []struct {
			SkyState      []skyState       `json:"skyState"`
			ProbPrec      []probPrec       `json:"probPrec"`
			SnowQuoteProb []snowQuoteProb  `json:"snowQuoteProb"`
			Ta            relativeHumidity `json:"ta"`
			Hr            relativeHumidity `json:"hr"`
			Wind          []wind           `json:"wind"`
			UvMax         float32          `json:"uvMax"`
			Date          string           `json:"date"`
		} `json:"day"`
	} `json:"prediction"`
}

type wind struct {
	Direction string  `json:"direction"`
	Vel       float32 `json:"vel"`
	Period    string  `json:"period"`
}

type probPrec struct {
	Value  float32 `json:"value"`
	Period string  `json:"period"`
}

type skyState struct {
	Value       string `json:"value"`
	Period      string `json:"period"`
	Description string `json:"description"`
}

type snowQuoteProb struct {
	Value  string `json:"value"`
	Period string `json:"period"`
}

type relativeHumidity struct {
	Max  float32 `json:"max"`
	Min  float32 `json:"min"`
	Data []struct {
		Value float32 `json:"value"`
		Hour  float32 `json:"hour"`
	} `json:"data"`
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
