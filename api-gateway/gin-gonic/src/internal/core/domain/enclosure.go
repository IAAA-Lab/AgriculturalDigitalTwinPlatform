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
		Crop               Crop    `json:"crop"`
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

type Crop struct {
	Id   string `json:"id"`
	Name string `json:"name"`
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

type Treatment struct {
	Date         time.Time `json:"date"`
	Broth        string    `json:"broth"`
	DoseKind     string    `json:"doseKind"`
	DoseMovement float64   `json:"doseMovement"`
	Quantity     float64   `json:"quantity"`
	DoseUnit     string    `json:"doseUnit"`
	SafePeriod   string    `json:"safePeriod"`
	HealthAgent  struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	} `json:"healthAgent"`
	Phytosanitary struct {
		Id      string `json:"id"`
		Name    string `json:"name"`
		Formula string `json:"formula"`
	} `json:"phytosanitary"`
	Plague struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	} `json:"plague"`
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
	Idema        string    `json:"idema"`
	Height       float32   `json:"height"`
	Date         time.Time `json:"date"`
	Prec         float32   `json:"prec"`
	Tmin         float32   `json:"tmin"`
	Tmax         float32   `json:"tmax"`
	Tmed         float32   `json:"tmed"`
	TminTime     string    `json:"tminTime"`
	TmaxTime     string    `json:"tmaxTime"`
	WindSpeed    float32   `json:"windSpeed"`
	WindDir      float32   `json:"windDir"`
	WindGust     float32   `json:"windGust"`
	WindGustTime string    `json:"windGustTime"`
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
