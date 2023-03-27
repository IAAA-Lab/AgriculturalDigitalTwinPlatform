from prefect import flow, task, get_run_logger
from .dto.forecast_weather_dto import ForecastWeather
import requests
import os


@task
def extract(parcelId: str):
    logger = get_run_logger()
    print("extracting data")
    logger.info("extracting data")

    # Extract data from Rest API

    AUTH_TOKEN = os.environ.get("AGROSLAB_AUTH_TOKEN")
    AGROSLAB_API_URL = os.environ.get("AGROSLAB_API_URL")

    municipality = parcelId.split("-")[1]
    if len(municipality) == 1:
        municipality = "00" + municipality
    elif len(municipality) == 2:
        municipality = "0" + municipality

    body = {
        "operation": "aemetprediccionmunicipio",
        "provincia": parcelId.split("-")[0],
        "municipio": municipality,
        "type": "diaria"
    }

    headers = {
        'Authorization': AUTH_TOKEN,
    }

    response = requests.post(
        AGROSLAB_API_URL, json=body, headers=headers)

    return response.json()

# type ForecastWeather struct {
# 	Origin       origin `json:"origin"`
# 	Type         string `json:"type"`
# 	ParcelId     string `json:"parcelId"`
# 	ElaboratedAt string `json:"elaboratedAt"`
# 	Municipality string `json:"municipality"`
# 	Province     string `json:"province"`
# 	Prediction   struct {
# 		Day []struct {
# 			ProbPrec []struct {
# 				Value  int    `json:"value"`
# 				Period string `json:"period"`
# 			} `json:"probPrec"`
# 			SnowQuote []struct {
# 				Value  string `json:"value"`
# 				Period string `json:"period"`
# 			} `json:"snowQuote"`
# 			SkyState []skyState `json:"skyState"`
# 			Wind     []struct {
# 				Direction string `json:"direction"`
# 				Speed     int    `json:"speed"`
# 				Period    string `json:"period"`
# 			} `json:"wind"`
# 			Ta struct {
# 				Tamax int `json:"Tamax"`
# 				Tamin int `json:"Tamin"`
# 			} `json:"ta"`
# 			Hr struct {
# 				Hrmax int `json:"Hrmax"`
# 				Hrmin int `json:"Hrmin"`
# 			} `json:"hr"`
# 			UvMax int    `json:"uvMax,omitempty"`
# 			Date  string `json:"date"`
# 		} `json:"day"`
# 	} `json:"prediction"`
# }

# type origin struct {
# 	Producer  string `json:"producer"`
# 	Web       string `json:"web"`
# 	Language  string `json:"language"`
# 	Copyright string `json:"copyright"`
# 	LegalNote string `json:"legalNote"`
# }

@task
def transform(data, parcelId) -> dict:
    logger = get_run_logger()
    print("transforming data")
    logger.info("transforming data")
    print(data)
    response = ForecastWeather.from_dict(data[0])
    forecast_weather = {
        "type": "forecast_weather",
        "parcelId": parcelId,
        "origin": {
            "producer": response.origen.productor,
            "web": response.origen.web,
            "language": response.origen.language,
            "copyright": response.origen.copyright,
            "legalNote": response.origen.notaLegal,
        },
        "elaboratedAt": response.elaborado,
        "municipality": response.nombre,
        "province": response.provincia,
        "prediction": {
            "day": map(lambda day: {
                "probPrec": map(lambda probPrec: {
                    "value": probPrec.value,
                    "period": probPrec.periodo
                }, day.probPrecipitacion),
                "snowQuote": map(lambda snowQuote: {
                    "value": snowQuote.value,
                    "period": snowQuote.periodo
                }, day.cotaNieveProv),
                "skyState": map(lambda skyState: {
                    "value": skyState.value,
                    "period": skyState.periodo
                }, day.estadoCielo),
                "wind": map(lambda wind: {
                    "direction": wind.direccion,
                    "speed": wind.velocidad,
                    "period": wind.periodo
                }, day.viento),
                "ta": {
                    "tamax": day.temperatura.maxima,
                    "tamin": day.temperatura.minima
                },
                "hr": {
                    "hrmax": day.humedadRelativa.maxima,
                    "hrmin": day.humedadRelativa.minima
                },
                "uvMax": day.uvMax,
                "date": day.fecha
            }, response.prediccion.dia)
        }
    }
    return forecast_weather



@flow(name="forecast_weather")
def forecast_weather(parcelId: str) -> dict:
    data = extract(parcelId)
    processed_data = transform(data, parcelId)
    return processed_data

if __name__ == "__main__":
    forecast_weather()