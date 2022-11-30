package weather.dto

import java.util.Calendar
import weather.domain.DailyWeather

enum class WeatherType(val value: String) {
  DAILY("diaria"),
  HOURLY("horaria"),
}

data class DailyWeatherReq(val parcelId: String = "", val date: Calendar = Calendar.getInstance())

data class AgroslabRequest(
    val operation: String = "aemetprediccionmunicipio",
    val provincia: String = "",
    val municipio: String = "",
    val type: String = WeatherType.HOURLY.value,
)

data class RequestIn(val payload: DailyWeatherReq? = null)

data class RequestOut(val errorMessage: String? = null, val payload: DailyWeather? = null)
