import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class DailyWeatherDataLake(
    @JsonProperty("meta") val meta: Meta,
    @JsonProperty("data") val data: DailyWeatherAgroslabResp
)

data class Meta(
    @JsonProperty("parcelId") val parcelId: String,
    @JsonProperty("type") val type: String,
)
