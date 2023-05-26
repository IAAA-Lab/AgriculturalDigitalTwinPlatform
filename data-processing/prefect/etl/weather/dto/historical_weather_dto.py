from typing import Any
from dataclasses import dataclass

@dataclass
class HistoricalWeatherDTO:
    fecha: str
    indicativo: str
    nombre: str
    provincia: str
    altitud: float
    tmed: float
    prec: float
    tmin: float
    horatmin: str
    tmax: float
    horatmax: str
    dir: float
    velmedia: float
    racha: float
    horaracha: str
    sol: float
    presMax: str
    horaPresMax: str
    presMin: str
    horaPresMin: str

    # Every key value can be : "01", "08", "9,4" "Del" or "20" (for example). We only want the ones that are numbers, if not set to 0. Moreover, every key is optional, so we have to check if it exists
    @staticmethod
    def from_dict(obj: Any) -> 'HistoricalWeatherDTO':
        _fecha = str(obj.get("fecha"))
        _indicativo = str(obj.get("indicativo"))
        _nombre = str(obj.get("nombre"))
        _provincia = str(obj.get("provincia"))
        _altitud = check_if_number(obj.get("altitud"))
        _tmed = check_if_number(obj.get("tmed"))
        _prec = check_if_number(obj.get("prec"))
        _tmin = check_if_number(obj.get("tmin"))
        _horatmin = str(obj.get("horatmin"))
        _tmax = check_if_number(obj.get("tmax"))
        _horatmax = str(obj.get("horatmax"))
        _dir = check_if_number(obj.get("dir"))
        _velmedia = check_if_number(obj.get("velmedia"))
        _racha = check_if_number(obj.get("racha"))
        _horaracha = str(obj.get("horaracha"))
        _sol = check_if_number(obj.get("sol"))
        _presMax = str(obj.get("presMax"))
        _horaPresMax = str(obj.get("horaPresMax"))
        _presMin = str(obj.get("presMin"))
        _horaPresMin = str(obj.get("horaPresMin"))



        return HistoricalWeatherDTO(_fecha, _indicativo, _nombre, _provincia, _altitud, _tmed, _prec, _tmin, _horatmin, _tmax, _horatmax, _dir, _velmedia, _racha, _horaracha, _sol, _presMax, _horaPresMax, _presMin, _horaPresMin)

# Example Usage
# jsonstring = json.loads(myjsonstring)
# root = Root.from_dict(jsonstring)
def check_if_number(obj: Any) -> float:
    try:
        return float(str(obj).replace(",", "."))
    except:
        return 0.0
