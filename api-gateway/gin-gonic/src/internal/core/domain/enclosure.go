package domain

import (
	"time"
)

// --- Database models ---
type Enclosure struct {
	Id       string `json:"id"`
	Year     int    `json:"year"`
	Type     string `json:"type"`
	Geometry struct {
		Type        string      `json:"type"`
		Coordinates interface{} `json:"coordinates"`
	} `json:"geometry"`
	MeteoStation struct {
		Idema    string  `json:"idema"`
		Name     string  `json:"name"`
		Distance float32 `json:"distance(km)"`
	} `json:"meteoStation"`
	Properties struct {
		IrrigationCoef float64 `json:"irrigationCoef"`
		// Admisibility      float64 `json:"admisibility"`
		GeographicSpot     string  `json:"geographicSpot"`
		CropId             string  `json:"cropId"`
		CropName           string  `json:"cropName"`
		AreaSIGPAC         float64 `json:"areaSIGPAC"`
		Area               float64 `json:"area"`
		VarietyId          string  `json:"varietyId"`
		RainfedOrIrrigated string  `json:"rainfedOrIrrigated"`
		TenureRegimeId     string  `json:"tenureRegimeId"`
		PlantationYear     int     `json:"plantationYear"`
		NumberOfTrees      int     `json:"numberOfTrees"`
		PlantationDensity  string  `json:"plantationDensity"`
		VulnerableArea     bool    `json:"vulnerableArea"`
		SpecificZones      bool    `json:"specificZones"`
		ParcelUse          string  `json:"parcelUse" bson:",truncate"`
		Slope              float64 `json:"slope"`
		UHC                string  `json:"uhc"`
		UHCDescription     string  `json:"uhcDescription"`
		ZEPAZone           bool    `json:"zepaZone"`
		SIEZone            bool    `json:"sieZone"`
	} `json:"properties"`
}

type CropStats struct {
	EnclosureId string    `json:"enclosureId"`
	Date        time.Time `json:"date"`
	Area        float64   `json:"area"`
	Production  float64   `json:"production"`
	Performance float64   `json:"performance"`
	Harvest     float64   `json:"harvest"`
}

type Fertilizer struct {
	EnclosureId string    `json:"enclosureId"`
	Name        string    `json:"name"`
	StartDate   time.Time `json:"startDate"`
	Quantity    float32   `json:"quantity"`
}

type Activity struct {
	Date        time.Time `json:"date"`
	EnclosureId string    `json:"enclosureId"`
	Activity    string    `json:"activity"`
	// Properties is a json object that contains the properties of the activity
	Properties map[string]interface{} `json:"properties"`
}

type NDVI struct {
	EnclosureId string  `json:"enclosureId"`
	AVG         float64 `json:"avg"`
	NDVI        []struct {
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
