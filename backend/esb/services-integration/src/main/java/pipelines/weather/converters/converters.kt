fun DailyWeatherReq.toAgroslabRequest(): AgroslabRequest {
        val parcel = parcelId.split("-")
        return AgroslabRequest(provincia = parcel[0], municipio = parcel[1])
}

fun DailyWeatherResp.toDailyWeather(parcelId: String) =
                DailyWeather(
                                parcelId = parcelId,
                                dataOrigin = origen.toOrigin(),
                                municipality = nombre,
                                province = provincia,
                                prediction = prediccion.toPrediccion()
                )

fun Origen.toOrigin() =
                Origin(
                                producer = productor,
                                web = web,
                                language = language,
                                copyright = copyright,
                                legalNote = notaLegal,
                )

fun Prediccion.toPrediccion() = Prediction(day = dia.map { it.toDay() })

fun Dia.toDay() =
                Day(
                                probPrec =
                                                probPrecipitacion.map {
                                                        it.toPrecipitationProbability()
                                                },
                                snowQuoteProb = cotaNieveProv.map { it.toSnowQuoteProb() },
                                skyState = estadoCielo.map { it.toSkyState() },
                                wind = viento.map { it.toWind() },
                                ta = temperatura.toRelativeHumidity(),
                                hr = humedadRelativa.toRelativeHumidity(),
                                uvMax = uvMax,
                                date = fecha
                )

fun ProbPrecipitacion.toPrecipitationProbability() =
                PrecipitationProbability(value = value, period = periodo)

fun CotaNieveProv.toSnowQuoteProb() = SnowQuoteProb(value = value, period = periodo)

fun EstadoCielo.toSkyState() = SkyState(value = value, period = periodo, description = descripcion)

fun Viento.toWind() = Wind(direction = direccion, vel = velocidad, period = periodo)

fun HumedadRelativa.toRelativeHumidity() =
                RelativeHumidity(max = maxima, min = minima, data = dato.map { it.toHrValue() })

fun Dato.toHrValue() = HrValue(value = value, hour = hora)
