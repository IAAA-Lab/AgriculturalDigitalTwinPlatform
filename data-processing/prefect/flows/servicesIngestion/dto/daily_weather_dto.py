from typing import List
from typing import Any
from dataclasses import dataclass
import json

@dataclass
class EstadoCielo:
    value: str = None
    periodo: str = None 
    descripcion: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'EstadoCielo':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        _descripcion = str(obj.get("descripcion"))
        return EstadoCielo(_value, _periodo, _descripcion)

@dataclass
class HumedadRelativa:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'HumedadRelativa':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return HumedadRelativa(_value, _periodo)

@dataclass
class Nieve:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'Nieve':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return Nieve(_value, _periodo)

@dataclass
class Origen:
    productor: str = None
    web: str = None
    enlace: str = None
    language: str = None
    copyright: str = None
    notaLegal: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'Origen':
        _productor = str(obj.get("productor"))
        _web = str(obj.get("web"))
        _enlace = str(obj.get("enlace"))
        _language = str(obj.get("language"))
        _copyright = str(obj.get("copyright"))
        _notaLegal = str(obj.get("notaLegal"))
        return Origen(_productor, _web, _enlace, _language, _copyright, _notaLegal)

@dataclass
class Precipitacion:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'Precipitacion':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return Precipitacion(_value, _periodo)

@dataclass
class ProbNieve:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'ProbNieve':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return ProbNieve(_value, _periodo)

@dataclass
class ProbPrecipitacion:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'ProbPrecipitacion':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return ProbPrecipitacion(_value, _periodo)

@dataclass
class ProbTormentum:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'ProbTormentum':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return ProbTormentum(_value, _periodo)

@dataclass
class SensTermica:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'SensTermica':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return SensTermica(_value, _periodo)

@dataclass
class Temperatura:
    value: str = None
    periodo: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'Temperatura':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return Temperatura(_value, _periodo)

@dataclass
class VientoAndRachaMax:
    direccion: List[str] = None
    velocidad: List[str] = None
    periodo: str = None
    value: str = None

    @staticmethod
    def from_dict(obj: Any) -> 'VientoAndRachaMax':
        _direccion = [str(y) for y in obj.get("direccion", [])]
        _velocidad = [str(y) for y in obj.get("velocidad", [])]
        _periodo = str(obj.get("periodo"))
        _value = str(obj.get("value"))
        return VientoAndRachaMax(_direccion, _velocidad, _periodo, _value)

@dataclass
class Dium:
    estadoCielo: List[EstadoCielo]
    precipitacion: List[Precipitacion]
    probPrecipitacion: List[ProbPrecipitacion]
    probTormenta: List[ProbTormentum]
    nieve: List[Nieve]
    probNieve: List[ProbNieve]
    temperatura: List[Temperatura]
    sensTermica: List[SensTermica]
    humedadRelativa: List[HumedadRelativa]
    vientoAndRachaMax: List[VientoAndRachaMax]
    fecha: str
    orto: str
    ocaso: str

    @staticmethod
    def from_dict(obj: Any) -> 'Dium':
        _estadoCielo = [EstadoCielo.from_dict(y) for y in obj.get("estadoCielo")]
        _precipitacion = [Precipitacion.from_dict(y) for y in obj.get("precipitacion")]
        _probPrecipitacion = [ProbPrecipitacion.from_dict(y) for y in obj.get("probPrecipitacion")]
        _probTormenta = [ProbTormentum.from_dict(y) for y in obj.get("probTormenta")]
        _nieve = [Nieve.from_dict(y) for y in obj.get("nieve")]
        _probNieve = [ProbNieve.from_dict(y) for y in obj.get("probNieve")]
        _temperatura = [Temperatura.from_dict(y) for y in obj.get("temperatura")]
        _sensTermica = [SensTermica.from_dict(y) for y in obj.get("sensTermica")]
        _humedadRelativa = [HumedadRelativa.from_dict(y) for y in obj.get("humedadRelativa")]
        _vientoAndRachaMax = [VientoAndRachaMax.from_dict(y) for y in obj.get("vientoAndRachaMax")]
        _fecha = str(obj.get("fecha"))
        _orto = str(obj.get("orto"))
        _ocaso = str(obj.get("ocaso"))
        return Dium(_estadoCielo, _precipitacion, _probPrecipitacion, _probTormenta, _nieve, _probNieve, _temperatura, _sensTermica, _humedadRelativa, _vientoAndRachaMax, _fecha, _orto, _ocaso)

@dataclass
class Prediccion:
    dia: List[Dium] = None

    @staticmethod
    def from_dict(obj: Any) -> 'Prediccion':
        _dia = [Dium.from_dict(y) for y in obj.get("dia")]
        return Prediccion(_dia)

@dataclass
class DailyWeather:
    origen: Origen = None
    elaborado: str = None
    nombre: str = None
    provincia: str = None
    prediccion: Prediccion  = None

    @staticmethod
    def from_dict(obj: Any) -> 'DailyWeather':
        _origen = Origen.from_dict(obj.get("origen"))
        _elaborado = str(obj.get("elaborado"))
        _nombre = str(obj.get("nombre"))
        _provincia = str(obj.get("provincia"))
        _prediccion = Prediccion.from_dict(obj.get("prediccion"))
        return DailyWeather(_origen, _elaborado, _nombre, _provincia, _prediccion)
    
# Example Usage
# jsonstring = json.loads(myjsonstring)
# root = Root.from_dict(jsonstring)