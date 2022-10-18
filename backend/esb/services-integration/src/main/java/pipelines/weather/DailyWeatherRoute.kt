import org.apache.camel.Exchange
import org.apache.camel.LoggingLevel
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.ListJacksonDataFormat

class DailyWeatherRoute : RouteBuilder() {

    data class RequestIn(val id: String, val payload: DailyWeatherReq)
    data class RequesOut(val id: String, val payload: DailyWeather)

    override fun configure() {

        // FIX: Just to test the route
        var bodyIn =
                RequestIn(
                        "1",
                        DailyWeatherReq(
                                operation = "aemetprediccionmunicipio",
                                provincia = "50",
                                municipio = "001",
                                type = WeatherType.DAILY.value,
                        ),
                )

        // Get request from RabbitMQ
        // from("rabbitmq://localhost:5672/weather?queue=daily-weather&autoDelete=false&durable=true")
        //         .log(LoggingLevel.INFO, "Received message from RabbitMQ: \${body}")
        //         .unmarshal(JacksonDataFormat(RequestIn::class.java))
        //         .setBody(constant(bodyIn))
        //         // For recovering it later in the response
        //         .setProperty("requestId", simple("\${body.id}"))
        //         .to("direct:weatherIn")

        // Call external service and process response
        from("timer:foo?period=10000")
                .setHeader("authorization", constant("{{agroslab.api_key}}"))
                .setHeader(Exchange.HTTP_METHOD, constant("POST"))
                .setHeader(Exchange.CONTENT_TYPE, constant("application/json"))
                // TODO: Id not working
                .setProperty("requestId", body())
                .setBody(constant(bodyIn.payload))
                .marshal()
                .json()
                .to("{{agroslab.uri}}")
                // Just for marshalling non utf-8 strange characters
                .convertBodyTo(String::class.java, "utf-8")
                .unmarshal(ListJacksonDataFormat(DailyWeatherResp::class.java))
                .process { exchange: Exchange ->
                    val payload = exchange.`in`.body as List<DailyWeatherResp>
                    val convertedPayload = payload[0].toDailyWeather()
                    // TODO: Id not working
                    exchange.`in`.body =
                            RequesOut(exchange.getProperty("requestId") as String, convertedPayload)
                }
                .to("direct:weatherOut")

        // Send response back to RabbitMQ
        from("direct:weatherOut")
                .marshal()
                .json()
                .log(LoggingLevel.INFO, "Sending to RabbitMQ: \${body}")
        // .to(
        //
        // "rabbitmq://localhost:5672/weather?queue=daily-weather&autoDelete=false&durable=true"
        // )
    }
}
