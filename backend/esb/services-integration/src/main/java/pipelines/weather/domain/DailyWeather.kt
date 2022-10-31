data class DailyWeather(
                val dataOrigin: Origin = Origin(),
                val municipality: String = "",
                val province: String = "",
                val prediction: Prediction = Prediction(),
)

data class Origin(
                val producer: String = "",
                val web: String = "",
                val language: String = "",
                val copyright: String = "",
                val legalNote: String = "",
)

data class Prediction(var day: List<Day> = listOf())

data class Day(
                val probPrec: List<PrecipitationProbability> = listOf(),
                val snowQuoteProb: List<SnowQuoteProb> = listOf(),
                val skyState: List<SkyState> = listOf(),
                val wind: List<Wind> = listOf(),
                val ta: RelativeHumidity = RelativeHumidity(),
                val hr: RelativeHumidity = RelativeHumidity(),
                val uvMax: Long? = null,
                val date: String = ""
)

data class SnowQuoteProb(val value: String = "", val period: String? = null)

data class SkyState(
                val value: String = "",
                val period: String? = null,
                val description: String = ""
)

data class HrValue(val value: Long = 0, val hour: Long = 0)

data class RelativeHumidity(
                val max: Long = 0,
                val min: Long = 0,
                val data: List<HrValue> = listOf()
)

data class PrecipitationProbability(val value: Long = 0, val period: String? = null)

data class Wind(val direction: String = "", val vel: Long = 0, val period: String? = null)
