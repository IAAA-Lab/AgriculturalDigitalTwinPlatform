import org.apache.camel.Exchange
import org.apache.camel.LoggingLevel
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.JacksonDataFormat
import org.apache.camel.component.jackson.ListJacksonDataFormat

class DailyWeatherRoute : RouteBuilder() {

  data class RequestIn(val id: String, val payload: DailyWeatherReq)
  data class RequestOut(val id: String, val payload: DailyWeather)

  val RABBIMQ_ROUTE =
      "rabbitmq:{{rabbitmq.digital_twin.exchange}}?queue={{rabbitmq.weather.queue}}&routingKey={{rabbitmq.weather.daily.routing_key}}&autoDelete=false"
  val AGROSLAB_URI = "{{agroslab.uri}}"
  val AGROSLAB_API_KEY = "{{agroslab.api_key}}"

  override fun configure() {

    // Consume request from RabbitMQ
    from(RABBIMQ_ROUTE)
        .log(LoggingLevel.INFO, "weather-daily", "Received message: \${body}")
        .unmarshal(JacksonDataFormat(RequestIn::class.java))
        .process { exchange: Exchange ->
          val request = exchange.`in`.getBody(RequestIn::class.java)
          // Save request id for later use
          exchange.`in`.setHeader("id", request.id)
        }
        // Call Agroslab API
        .setHeader("Accept", constant("application/json"))
        .setHeader("authorization", constant(AGROSLAB_API_KEY))
        .setHeader(Exchange.HTTP_METHOD, constant("POST"))
        .to(AGROSLAB_URI)
        .log(LoggingLevel.INFO, "weather-daily", "Response from Agroslab: \${body}")
        .unmarshal(ListJacksonDataFormat(DailyWeather::class.java))
        .process { exchange: Exchange ->
          // Get request id from exchange headers
          val id = exchange.`in`.getHeader("id", String::class.java)
          val payload = exchange.`in`.getBody(List::class.java)
          exchange.`in`.setBody(RequestOut(id, payload[0] as DailyWeather))
        }
        // Send response to RabbitMQ
        .marshal(JacksonDataFormat(RequestOut::class.java))
        .log(LoggingLevel.INFO, "weather-daily", "Sending message: \${body}")
        .to(RABBIMQ_ROUTE)
  }
}
