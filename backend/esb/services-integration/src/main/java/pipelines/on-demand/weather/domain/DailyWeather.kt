data class DailyWeather(
    val type: String = "daily_weather",
    val parcelId: String = "",
    val origin: Origin,
    val elaboratedAt: String,
    val municipality: String,
    val province: String,
    var prediction: List<Prediction>,
)

data class Origin(
    val producer: String,
    val web: String,
    val language: String,
    val copyright: String,
    val legalNote: String
)

data class Prediction(
    val skyState: List<SkyState>,
    val prec: List<GenericState>,
    val probPrec: List<GenericState>,
    val probStorm: List<GenericState>,
    val snow: List<GenericState>,
    val probSnow: List<GenericState>,
    val ta: List<GenericState>,
    val hr: List<GenericState>,
    val wind: List<WindState>,
    val date: String,
    val dawn: String,
    val sunset: String
)

data class SkyState(val value: String, val period: String?, val description: String)

data class GenericState(
    val value: Float,
    val period: String?,
)

data class WindState(
    val direction: String,
    val speed: Float,
    val period: String?,
    val value: Float,
)
