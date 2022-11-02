import com.fasterxml.jackson.annotation.JsonProperty

data class DailyWeatherAgroslabResp(
                @JsonProperty("origen") val origen: Origen,
                @JsonProperty("elaborado") val elaborado: String,
                @JsonProperty("nombre") val nombre: String,
                @JsonProperty("provincia") val provincia: String,
                @JsonProperty("prediccion") val prediccion: Prediccion,
                @JsonProperty("id") val id: String,
                @JsonProperty("version") val version: String,
)

data class Origen(
                @JsonProperty("productor") val productor: String,
                @JsonProperty("web") val web: String,
                @JsonProperty("enlace") val enlace: String,
                @JsonProperty("language") val language: String,
                @JsonProperty("copyright") val copyright: String,
                @JsonProperty("notaLegal") val notaLegal: String
)

data class Prediccion(@JsonProperty("dia") val dia: List<Dia>)

data class Dia(
                @JsonProperty("estadoCielo") val estadoCielo: List<EstadoCielo>,
                @JsonProperty("precipitacion") val precipitacion: List<Precipitacion>,
                @JsonProperty("probPrecipitacion") val probPrecipitacion: List<ProbPrecipitacion>,
                @JsonProperty("probTormenta") val probTormenta: List<ProbTormenta>,
                @JsonProperty("nieve") val nieve: List<Nieve>,
                @JsonProperty("probNieve") val probNieve: List<ProbNieve>,
                @JsonProperty("temperatura") val temperatura: List<Temperatura>,
                @JsonProperty("sensTermica") val sensTermica: List<SensTermica>,
                @JsonProperty("humedadRelativa") val humedadRelativa: List<HumedadRelativa>,
                @JsonProperty("vientoAndRachaMax") val vientoAndRachaMax: List<VientoAndRachaMax>,
                @JsonProperty("fecha") val fecha: String,
                @JsonProperty("orto") val orto: String,
                @JsonProperty("ocaso") val ocaso: String,
)

data class EstadoCielo(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
                @JsonProperty("descripcion") val descripcion: String,
)

data class HumedadRelativa(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class ProbPrecipitacion(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class Precipitacion(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class ProbTormenta(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class Nieve(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class ProbNieve(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class SensTermica(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class Temperatura(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("value") val value: String,
)

data class VientoAndRachaMax(
                @JsonProperty("periodo") val periodo: String?,
                @JsonProperty("direccion") val direccion: List<String>? = null,
                @JsonProperty("velocidad") val velocidad: List<String>? = null,
                @JsonProperty("value") val value: String? = null,
)
