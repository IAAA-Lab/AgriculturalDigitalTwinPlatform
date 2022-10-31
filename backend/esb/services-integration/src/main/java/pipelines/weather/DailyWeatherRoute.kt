import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.camel.Exchange
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.JacksonDataFormat
import org.apache.camel.component.jackson.ListJacksonDataFormat

class DailyWeatherRoute : RouteBuilder() {

  val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")

  data class RequestIn(val payload: DailyWeatherReq? = null)
  data class RequestOut(val errorMessage: String? = null, val payload: List<DailyWeather>)

  val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.routing_key}}"
  val AGROSLAB_URI = "{{agroslab.uri}}"
  val AGROSLAB_API_KEY = "{{agroslab.api_key}}"

  override fun configure() {

    // TODO: catch error
    // Consume request from RabbitMQ
    from(RABBIMQ_ROUTE)
        // Unmarshal and process request
        .unmarshal(JacksonDataFormat(RequestIn::class.java))
        .process { exchange: Exchange ->
          val request = exchange.`in`.getBody(RequestIn::class.java)
          val agroslabRequest = request.payload?.toAgroslabRequest()
          exchange.`in`.setBody(agroslabRequest, AgroslabRequest::class.java)
        }
        .marshal(JacksonDataFormat(AgroslabRequest::class.java))
        // Call Agroslab API
        .setHeader("Accept", constant("application/json"))
        .setHeader("Authorization", constant(AGROSLAB_API_KEY))
        .setHeader(Exchange.HTTP_METHOD, constant("POST"))
        .to(AGROSLAB_URI)
        // Processresponse and send to RabbitMQ
        .convertBodyTo(String::class.java, "utf-8")
        .unmarshal(ListJacksonDataFormat(DailyWeatherResp::class.java))
        .process { convertToDomain(it) }
        .to("direct:save-to-data-lake")
        .to("direct:send-back-to-rabbitmq")

    from("direct:save-to-data-lake").log("Saving to data lake").end()

    from("direct:send-back-to-rabbitmq")
        .process { processAgroslabResponse(it) }
        .marshal(JacksonDataFormat(RequestOut::class.java))
  }

  fun convertToDomain(exchange: Exchange) {
    val payload = exchange.`in`.getBody(List::class.java)
    var dailyWeather = payload.map { it as DailyWeatherResp }.map { it.toDailyWeather() }
    exchange.`in`.setBody(dailyWeather)
  }

  fun processAgroslabResponse(exchange: Exchange) {
    val dailyWeather = exchange.`in`.getBody(List::class.java) as List<DailyWeather>
    // Get the current day weather
    var localDate = Calendar.getInstance()
    localDate.set(Calendar.HOUR_OF_DAY, 0)
    localDate.set(Calendar.MINUTE, 0)
    localDate.set(Calendar.SECOND, 0)
    val today = formatter.format(localDate.time)
    val todayWeather = dailyWeather[0].prediction.day.filter { it.date == today }
    dailyWeather[0].prediction.day = todayWeather
    exchange.`in`.setBody(RequestOut(payload = dailyWeather))
    // Set response back to exchange
  }
}
