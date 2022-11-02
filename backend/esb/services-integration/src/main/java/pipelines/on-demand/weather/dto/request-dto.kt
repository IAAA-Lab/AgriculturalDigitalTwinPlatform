import java.util.Calendar

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
