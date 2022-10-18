fun DailyWeatherResp.toDailyWeather() =
        DailyWeather(
                dataOrigin = origen.toOrigen(),
                municipality = nombre,
                province = provincia,
                prediction = prediccion.toPrediccion()
        )

fun Origen.toOrigen() =
        Origin(
                producer = productor,
                web = web,
                language = language,
        )

fun Prediccion.toPrediccion() = Prediction(dia = dia.map { it.toDay() })

fun Dia.toDay() =
        Day(
                probPrec = probPrecipitacion.map { it.toPrecipitationProbability() },
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

fun EstadoCielo.toSkyState() = SkyState(value = value, periodo = periodo, descripcion = descripcion)

fun Viento.toWind() = Wind(direction = direccion, vel = velocidad, period = periodo)

fun HumedadRelativa.toRelativeHumidity() =
        RelativeHumidity(max = maxima, min = minima, dato = dato.map { it.toHrValue() })

fun Dato.toHrValue() = HrValue(value = value, hour = hora)
