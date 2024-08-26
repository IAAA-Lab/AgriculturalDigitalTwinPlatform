from typing import Any
def check_if_number(obj: Any) -> float:
    try:
        return float(str(obj).replace(",", "."))
    except:
        return 0.0
historical_weather_dto ={
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "altitud": {
        "type": "string"
      },
      "dir": {
        "type": "string"
      },
      "fecha": {
        "type": "string"
      },
      "horaHrMax": {
        "type": "string"
      },
      "horaHrMin": {
        "type": "string"
      },
      "horaPresMax": {
        "type": "string"
      },
      "horaPresMin": {
        "type": "string"
      },
      "horaracha": {
        "type": "string"
      },
      "horatmax": {
        "type": "string"
      },
      "horatmin": {
        "type": "string"
      },
      "hrMax": {
        "type": "string"
      },
      "hrMedia": {
        "type": "string"
      },
      "hrMin": {
        "type": "string"
      },
      "indicativo": {
        "type": "string"
      },
      "nombre": {
        "type": "string"
      },
      "prec": {
        "type": "string"
      },
      "presMax": {
        "type": "string"
      },
      "presMin": {
        "type": "string"
      },
      "provincia": {
        "type": "string"
      },
      "racha": {
        "type": "string"
      },
      "sol": {
        "type": "string"
      },
      "tmax": {
        "type": "string"
      },
      "tmed": {
        "type": "string"
      },
      "tmin": {
        "type": "string"
      },
      "velmedia": {
        "type": "string"
      }
    }
  }
}