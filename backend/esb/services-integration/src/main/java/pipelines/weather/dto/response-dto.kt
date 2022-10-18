data class DailyWeatherResp(
        val origen: Origen = Origen(),
        val elaborado: String = "",
        val nombre: String = "",
        val provincia: String = "",
        val prediccion: Prediccion = Prediccion(),
        val id: Long = 0,
        val version: Double = 0.0
)

data class Origen(
        val productor: String = "",
        val web: String = "",
        val enlace: String = "",
        val language: String = "",
        val copyright: String = "",
        val notaLegal: String = "",
)

data class Prediccion(val dia: List<Dia> = listOf())

data class Dia(
        val probPrecipitacion: List<ProbPrecipitacion> = listOf(),
        val cotaNieveProv: List<CotaNieveProv> = listOf(),
        val estadoCielo: List<EstadoCielo> = listOf(),
        val viento: List<Viento> = listOf(),
        val rachaMax: List<CotaNieveProv> = listOf(),
        val temperatura: HumedadRelativa = HumedadRelativa(),
        val sensTermica: HumedadRelativa = HumedadRelativa(),
        val humedadRelativa: HumedadRelativa = HumedadRelativa(),
        val uvMax: Long? = null,
        val fecha: String = ""
)

data class CotaNieveProv(val value: String = "", val periodo: String? = null)

data class EstadoCielo(
        val value: String = "",
        val periodo: String? = null,
        val descripcion: String = ""
)

data class HumedadRelativa(
        val maxima: Long = 0,
        val minima: Long = 0,
        val dato: List<Dato> = listOf()
)

data class Dato(val value: Long = 0, val hora: Long = 0)

data class ProbPrecipitacion(val value: Long = 0, val periodo: String? = null)

data class Viento(val direccion: String = "", val velocidad: Long = 0, val periodo: String? = null)
