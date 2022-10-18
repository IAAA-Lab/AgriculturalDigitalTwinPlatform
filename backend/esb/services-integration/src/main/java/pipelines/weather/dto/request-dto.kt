enum class WeatherType(val value: String) {
        DAILY("diaria"),
        HOURLY("horaria"),
}

data class DailyWeatherReq(
                val operation: String = "aemetprediccionmunicipio",
                val provincia: String,
                val municipio: String,
                val type: String,
)
