package parcels.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty

@JsonIgnoreProperties(ignoreUnknown = true)
data class ParcelsAgroslabResp(
        val type: String,
        @JsonProperty("totalFeatures") val totalFeatures: Long,
        @JsonProperty("features") val features: List<Feature>,
        @JsonProperty("crs") val crs: Any?
)

data class Feature(
        @JsonProperty("type") val type: String,
        @JsonProperty("id") val id: String,
        @JsonProperty("geometry") val geometry: Geometry,
        @JsonProperty("geometry_name") val geometryName: String,
        @JsonProperty("properties") val properties: Any?
)

data class Geometry(
        @JsonProperty("type") val type: String,
        @JsonProperty("coordinates") val coordinates: List<List<List<Double>>>
)

data class EnclosuresAgroslabResp(
        @JsonProperty("type") val type: String,
        @JsonProperty("totalFeatures") val totalFeatures: Long,
        @JsonProperty("features") val features: List<Feature>,
        @JsonProperty("crs") val crs: Any?
)
