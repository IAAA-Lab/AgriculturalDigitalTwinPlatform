from typing import List
from typing import Any
from dataclasses import dataclass
import json
@dataclass
class CotaNieveProv:
    value: str
    periodo: str

    @staticmethod
    def from_dict(obj: Any) -> 'CotaNieveProv':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return CotaNieveProv(_value, _periodo)

@dataclass
class Dato:
    value: int
    hora: int

    @staticmethod
    def from_dict(obj: Any) -> 'Dato':
        _value = int(obj.get("value"))
        _hora = int(obj.get("hora"))
        return Dato(_value, _hora)

@dataclass
class EstadoCielo:
    value: str
    periodo: str
    descripcion: str

    @staticmethod
    def from_dict(obj: Any) -> 'EstadoCielo':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        _descripcion = str(obj.get("descripcion"))
        return EstadoCielo(_value, _periodo, _descripcion)

@dataclass
class HumedadRelativa:
    maxima: int
    minima: int
    dato: List[Dato]

    @staticmethod
    def from_dict(obj: Any) -> 'HumedadRelativa':
        _maxima = int(obj.get("maxima"))
        _minima = int(obj.get("minima"))
        _dato = [Dato.from_dict(y) for y in obj.get("dato")]
        return HumedadRelativa(_maxima, _minima, _dato)

@dataclass
class Origen:
    productor: str
    web: str
    enlace: str
    language: str
    copyright: str
    notaLegal: str

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
class ProbPrecipitacion:
    value: int
    periodo: str

    @staticmethod
    def from_dict(obj: Any) -> 'ProbPrecipitacion':
        _value = int(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return ProbPrecipitacion(_value, _periodo)

@dataclass
class RachaMax:
    value: str
    periodo: str

    @staticmethod
    def from_dict(obj: Any) -> 'RachaMax':
        _value = str(obj.get("value"))
        _periodo = str(obj.get("periodo"))
        return RachaMax(_value, _periodo)

@dataclass
class SensTermica:
    maxima: int
    minima: int
    dato: List[Dato]

    @staticmethod
    def from_dict(obj: Any) -> 'SensTermica':
        _maxima = int(obj.get("maxima"))
        _minima = int(obj.get("minima"))
        _dato = [Dato.from_dict(y) for y in obj.get("dato")]
        return SensTermica(_maxima, _minima, _dato)

@dataclass
class Temperatura:
    maxima: int
    minima: int
    dato: List[Dato]

    @staticmethod
    def from_dict(obj: Any) -> 'Temperatura':
        _maxima = int(obj.get("maxima"))
        _minima = int(obj.get("minima"))
        _dato = [Dato.from_dict(y) for y in obj.get("dato")]
        return Temperatura(_maxima, _minima, _dato)

@dataclass
class Viento:
    direccion: str
    velocidad: int
    periodo: str

    @staticmethod
    def from_dict(obj: Any) -> 'Viento':
        _direccion = str(obj.get("direccion"))
        _velocidad = int(obj.get("velocidad"))
        _periodo = str(obj.get("periodo"))
        return Viento(_direccion, _velocidad, _periodo)

@dataclass
class Dium:
    probPrecipitacion: List[ProbPrecipitacion]
    cotaNieveProv: List[CotaNieveProv]
    estadoCielo: List[EstadoCielo]
    viento: List[Viento]
    rachaMax: List[RachaMax]
    temperatura: Temperatura
    sensTermica: SensTermica
    humedadRelativa: HumedadRelativa
    uvMax: int
    fecha: str

    @staticmethod
    def from_dict(obj: Any) -> 'Dium':
        _probPrecipitacion = [ProbPrecipitacion.from_dict(y) for y in obj.get("probPrecipitacion")]
        _cotaNieveProv = [CotaNieveProv.from_dict(y) for y in obj.get("cotaNieveProv")]
        _estadoCielo = [EstadoCielo.from_dict(y) for y in obj.get("estadoCielo")]
        _viento = [Viento.from_dict(y) for y in obj.get("viento")]
        _rachaMax = [RachaMax.from_dict(y) for y in obj.get("rachaMax")]
        _temperatura = Temperatura.from_dict(obj.get("temperatura"))
        _sensTermica = SensTermica.from_dict(obj.get("sensTermica"))
        _humedadRelativa = HumedadRelativa.from_dict(obj.get("humedadRelativa"))
        _uvMax = int(obj.get("uvMax", -1))
        _fecha = str(obj.get("fecha", ""))
        return Dium(_probPrecipitacion, _cotaNieveProv, _estadoCielo, _viento, _rachaMax, _temperatura, _sensTermica, _humedadRelativa, _uvMax, _fecha)

@dataclass
class Prediccion:
    dia: List[Dium]

    @staticmethod
    def from_dict(obj: Any) -> 'Prediccion':
        _dia = [Dium.from_dict(y) for y in obj.get("dia")]
        return Prediccion(_dia)

@dataclass
class ForecastWeather:
    origen: Origen
    elaborado: str
    nombre: str
    provincia: str
    prediccion: Prediccion
    id: int
    version: float

    @staticmethod
    def from_dict(obj: Any) -> 'ForecastWeather':
        _origen = Origen.from_dict(obj.get("origen"))
        _elaborado = str(obj.get("elaborado"))
        _nombre = str(obj.get("nombre"))
        _provincia = str(obj.get("provincia"))
        _prediccion = Prediccion.from_dict(obj.get("prediccion"))
        _id = int(obj.get("id"))
        _version = float(obj.get("version"))
        return ForecastWeather(_origen, _elaborado, _nombre, _provincia, _prediccion, _id, _version)

# Example Usage
# jsonstring = json.loads(myjsonstring)
# root = Root.from_dict(jsonstring)
