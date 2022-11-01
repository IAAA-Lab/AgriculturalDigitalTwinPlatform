enum class WeatherType(val value: String) {
        DAILY("diaria"),
        HOURLY("horaria"),
}

data class DailyWeatherReq(
                val parcelId: String = "",
                val date: String = "",
)

data class AgroslabRequest(
                val operation: String = "aemetprediccionmunicipio",
                val provincia: String = "",
                val municipio: String = "",
                val type: String = WeatherType.DAILY.value,
)
