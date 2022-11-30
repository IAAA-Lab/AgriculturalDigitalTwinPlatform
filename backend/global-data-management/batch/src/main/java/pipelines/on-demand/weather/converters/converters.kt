package weather.converters

import kotlin.text.toFloat
import weather.domain.*
import weather.dto.*

fun DailyWeatherReq.toAgroslabRequest(): AgroslabRequest {
        val parcel = parcelId.split("-")
        return AgroslabRequest(provincia = parcel[0], municipio = parcel[1])
}

fun DailyWeatherAgroslabResp.toDailyWeather(parcelId: String) =
                DailyWeather(
                                parcelId = parcelId,
                                elaboratedAt = elaborado,
                                municipality = nombre,
                                province = provincia,
                                origin =
                                                Origin(
                                                                producer = origen.productor,
                                                                web = origen.web,
                                                                language = origen.language,
                                                                legalNote = origen.notaLegal,
                                                                copyright = origen.copyright
                                                ),
                                prediction = prediccion.dia.map { it.toPrediction() }
                )

fun Dia.toPrediction() =
                Prediction(
                                skyState = estadoCielo.map { it.toSkyState() },
                                prec = precipitacion.map { it.toGenericState() },
                                probPrec = probPrecipitacion.map { it.toGenericState() },
                                probStorm = probTormenta.map { it.toGenericState() },
                                snow = nieve.map { it.toGenericState() },
                                probSnow = probNieve.map { it.toGenericState() },
                                ta = temperatura.map { it.toGenericState() },
                                hr = humedadRelativa.map { it.toGenericState() },
                                wind = vientoAndRachaMax.map { it.toWindState() },
                                date = fecha,
                                dawn = orto,
                                sunset = ocaso
                )

fun EstadoCielo.toSkyState(): SkyState {
        return SkyState(value = value, period = periodo, description = descripcion)
}

fun HumedadRelativa.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun Temperatura.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun Precipitacion.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun ProbPrecipitacion.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun ProbTormenta.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun Nieve.toGenericState() = GenericState(value = stringToFloat(value), period = periodo)

fun ProbNieve.toGenericState(): GenericState {
        return GenericState(value = stringToFloat(value), period = periodo)
}

fun VientoAndRachaMax.toWindState() =
                WindState(
                                direction = direccion?.get(0) ?: "",
                                speed = velocidad?.get(0)?.toFloat() ?: 0f,
                                period = periodo,
                                value = stringToFloat(value ?: "0")
                )

fun stringToFloat(value: String): Float {
        try {
                return value.toFloat()
        } catch (e: Exception) {
                // In cases where the value is "lp" (precipitacion despreciable) or "null"
                return 0f
        }
}
