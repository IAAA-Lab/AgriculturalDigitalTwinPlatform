package domain

import (
	"time"
)

// --- Database models ---
type DigitalTwin struct {
	Id       string `json:"id"`
	Year     int    `json:"year"`
	Type     string `json:"type"`
	Geometry struct {
		Type        string        `json:"type"`
		Coordinates [][][]float64 `json:"coordinates"`
	} `json:"geometry"`
	Properties struct {
		UserID       string `json:"userId"`
		MeteoStation struct {
			Idema    string  `json:"idema"`
			Name     string  `json:"name"`
			Distance float32 `json:"distance(km)"`
		} `json:"meteoStation"`
		Location struct {
			CCAA           string `json:"ccaa"`
			Province       string `json:"province"`
			City           string `json:"city"`
			Municipality   string `json:"municipality"`
			GeographicSpot string `json:"geographicSpot"`
		} `json:"location"`
		Crop struct {
			Id        string `json:"id"`
			Name      string `json:"name"`
			Variety   string `json:"variety"`
			VarietyId string `json:"varietyId"`
		} `json:"crop"`
		IrrigationCoef     float64 `json:"irrigationCoef"`
		Admisibility       float64 `json:"admisibility"`
		AreaSIGPAC         float64 `json:"areaSIGPAC"`
		Area               float64 `json:"area"`
		RainfedOrIrrigated string  `json:"rainfedOrIrrigated"`
		// TenureRegimeId     string  `json:"tenureRegimeId"`
		// NumberOfTrees     int    `json:"numberOfTrees"`
		// PlantationDensity string `json:"plantationDensity"`
		// VulnerableArea    bool   `json:"vulnerableArea"`
		// SpecificZones      bool    `json:"specificZones"`
		ParcelUse string  `json:"parcelUse" bson:",truncate"`
		Slope     float64 `json:"slope"`
		// UHC                string  `json:"uhc"`
		// UHCDescription     string  `json:"uhcDescription"`
		// ZEPAZone           bool    `json:"zepaZone"`
		// SIEZone            bool    `json:"sieZone"`
	} `json:"properties"`
}

type CropStats struct {
	EnclosureId  string    `json:"enclosureId"`
	Date         time.Time `json:"date"`
	Area         float64   `json:"area"`
	Production   float64   `json:"production"`
	Performance  float64   `json:"performance"`
	Harvest      float64   `json:"harvest"`
	HarvestDate  time.Time `json:"harvestDate"`
	PlantingDate time.Time `json:"plantingDate"`
	Mocked       bool      `json:"mocked"`
}

type Fertilizer struct {
	EnclosureId string    `json:"enclosureId"`
	Name        string    `json:"name"`
	StartDate   time.Time `json:"startDate"`
	Quantity    float32   `json:"quantity"`
}

type Activity struct {
	Date     time.Time `json:"date"`
	Activity string    `json:"activity"`
	// Properties is a json object that contains the properties of the activity
	Yield float64 `json:"yield"`
}

type NDVI struct {
	AVG  float64 `json:"avg"`
	NDVI []struct {
		Date  time.Time `json:"date"`
		Value float64   `json:"value"`
	} `json:"ndvi"`
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
	Origin struct {
		Producer  string `json:"producer"`
		Web       string `json:"web"`
		Language  string `json:"language"`
		Copyright string `json:"copyright"`
		LegalNote string `json:"legalNote"`
	} `json:"origin"`
	Type         string `json:"type"`
	EnclosureId  string `json:"enclosureId"`
	ElaboratedAt string `json:"elaboratedAt"`
	Municipality string `json:"municipality"`
	Province     string `json:"province"`
	Prediction   struct {
		Day []struct {
			ProbPrec []struct {
				Value  int    `json:"value"`
				Period string `json:"period"`
			} `json:"probPrec"`
			SnowQuote []struct {
				Value  string `json:"value"`
				Period string `json:"period"`
			} `json:"snowQuote"`
			SkyState []struct {
				Value       string `json:"value"`
				Period      string `json:"period"`
				Description string `json:"description,omitempty"`
			} `json:"skyState"`
			Wind []struct {
				Direction string `json:"direction"`
				Speed     int    `json:"speed"`
				Period    string `json:"period"`
			} `json:"wind"`
			Ta struct {
				Tamax int `json:"tamax"`
				Tamin int `json:"tamin"`
			} `json:"ta"`
			Hr struct {
				Hrmax int `json:"hrmax"`
				Hrmin int `json:"hrmin"`
			} `json:"hr"`
			UvMax int    `json:"uvMax,omitempty"`
			Date  string `json:"date"`
		} `json:"day"`
	} `json:"prediction"`
}

type HistoricalWeather struct {
	Idema        string    `json:"idema,omitempty"`
	Height       float64   `json:"height,omitempty"`
	Date         time.Time `json:"date,omitempty"`
	Prec         float64   `json:"prec,omitempty"`
	Tmin         float64   `json:"tmin,omitempty"`
	Tmax         float64   `json:"tmax,omitempty"`
	Tmed         float64   `json:"tmed,omitempty"`
	TminTime     string    `json:"tminTime,omitempty"`
	TmaxTime     string    `json:"tmaxTime,omitempty"`
	WindSpeed    float64   `json:"windSpeed,omitempty"`
	WindDir      float64   `json:"windDir,omitempty"`
	WindGust     float64   `json:"windGust,omitempty"`
	WindGustTime string    `json:"windGustTime,omitempty"`
}

type DailyWeather struct {
	Type        string `json:"type"`
	EnclosureId string `json:"enclosureId"`
	Origin      struct {
		Producer  string `json:"producer"`
		Web       string `json:"web"`
		Language  string `json:"language"`
		Copyright string `json:"copyright"`
		LegalNote string `json:"legalNote"`
	} `json:"origin"`
	ElaboratedAt string `json:"elaboratedAt"`
	Municipality string `json:"municipality"`
	Province     string `json:"province"`
	Prediction   []struct {
		SkyState []struct {
			Value       string `json:"value"`
			Period      string `json:"period"`
			Description string `json:"description,omitempty"`
		} `json:"skyState"`
		Prec []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"prec"`
		ProbPrec []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"probPrec"`
		ProbStorm []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"probStorm"`
		Snow []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"snow"`
		ProbSnow []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"probSnow"`
		Ta []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"ta"`
		Hr []struct {
			Value  string `json:"value"`
			Period string `json:"period"`
		} `json:"hr"`
		Wind []struct {
			Period    string   `json:"period"`
			Direction []string `json:"direction"`
			Speed     []string `json:"speed"`
		} `json:"wind"`
		Date   string `json:"date"`
		Dawn   string `json:"dawn"`
		Sunset string `json:"sunset"`
	} `json:"prediction"`
}

type Prediction struct {
	Date  time.Time `json:"date"`
	Type  string    `json:"type"`
	Yield float64   `json:"yield,omitempty"`
}

type SensorData struct {
	Timestamp time.Time   `json:"timestamp"`
	Type      string      `json:"type"`
	Value     interface{} `json:"value"`
	Unit      string      `json:"unit"`
}

type SimulationResults struct {
	Date          string  `json:"date"`
	NumTrees      int     `json:"numTrees"`
	AffectedTrees int     `json:"affectedTrees"`
	DeadTrees     int     `json:"deadTrees"`
	Yield         int     `json:"yield"`
	HarvestKg     float64 `json:"harvestKg"`
}

type Simulation struct {
	SimulationId string              `json:"simulationId"`
	TimeStamp    time.Time           `json:"timestamp"`
	StartDate    time.Time           `json:"startDate"`
	EndDate      time.Time           `json:"endDate"`
	NumTrees     int                 `json:"numTrees"`
	Results      []SimulationResults `json:"results"`
}
