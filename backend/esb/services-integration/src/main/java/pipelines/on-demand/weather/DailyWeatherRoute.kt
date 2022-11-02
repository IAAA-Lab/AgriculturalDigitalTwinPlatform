import com.mongodb.client.model.Filters
import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.camel.Exchange
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.JacksonDataFormat
import org.apache.camel.component.jackson.ListJacksonDataFormat
import org.apache.camel.component.mongodb.MongoDbConstants

class DailyWeatherRoute : RouteBuilder() {

  data class RequestIn(val payload: DailyWeatherReq? = null)
  data class RequestOut(val errorMessage: String? = null, val payload: DailyWeather)

  val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
  val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.routing_key}}"
  val AGROSLAB_URI = "{{agroslab.uri}}"
  val AGROSLAB_API_KEY = "{{agroslab.api_key}}"

  override fun configure() {

    // TODO: catch error
    // Consume request from RabbitMQ
    from(RABBIMQ_ROUTE)
        .log("Received request: \${body}")
        .unmarshal(JacksonDataFormat(RequestIn::class.java))
        .to("direct:request-to-web-service")
    // .to("direct:request-to-data-lake")
    // .choice()
    // .`when`(simple("\${body} == null"))
    // // TODO: set previous body, the received request
    // .to("direct:request-to-web-service")
    // .otherwise()
    // .to("direct:process-web-service-response")

    from("direct:request-to-data-lake")
        .setHeader(
            MongoDbConstants.CRITERIA,
            constant(
                Filters.and(
                    Filters.eq("parcelId", "\${body.payload?.parcelId}"),
                    Filters.eq("prediction.date", "\${body.payload?.date}")
                )
            )
        )
        .to("mongodb:camelMongoClient?database=test&collection=Data&operation=findOneByQuery")
        .log("Received data from data lake: \${body}")

    from("direct:request-to-web-service")
        .process { processAgroslabRequest(it) }
        .marshal(JacksonDataFormat(AgroslabRequest::class.java))
        // Call Agroslab API
        .setHeader("Accept", constant("application/json"))
        .setHeader("Authorization", constant(AGROSLAB_API_KEY))
        .setHeader(Exchange.HTTP_METHOD, constant("POST"))
        .to(AGROSLAB_URI)
        // Process response and send to RabbitMQ
        .convertBodyTo(String::class.java, "utf-8")
        .unmarshal(ListJacksonDataFormat(DailyWeatherAgroslabResp::class.java))
        .multicast()
        // .parallelProcessing()
        .to("direct:process-web-service-response")
    // TODO: unknown loop error (maybe removing rabbitmq header?)
    // .to("direct:save-to-data-lake")

    from("direct:save-to-data-lake")
        // camelMongoClient is a bean defined in the application.properties
        // injected
        // automatically
        // by quarkus (quarkus.mongodb.connection-string)
        .to("mongodb:camelMongoClient?database=test&collection=Data&operation=insert")
        .log("Saving to data lake \${body}")
        .stop()

    from("direct:process-web-service-response")
        .process { processAgroslabResponse(it) }
        .marshal(JacksonDataFormat(RequestOut::class.java))
        .log("Sending response to RabbitMQ ...")
  }

  fun processAgroslabRequest(exchange: Exchange) {
    val request = exchange.`in`.getBody(RequestIn::class.java)
    println("Processing request: $request")
    val agroslabRequest = request.payload?.toAgroslabRequest()
    exchange.`in`.setBody(agroslabRequest, AgroslabRequest::class.java)
    // To recover later
    exchange.`in`.setHeader("parcelId", request.payload?.parcelId)
  }

  fun processAgroslabResponse(exchange: Exchange) {
    val payload = exchange.`in`.getBody(List::class.java)
    val parcelId = exchange.`in`.getHeader("parcelId") as String
    var dailyWeather =
        payload.map { it as DailyWeatherAgroslabResp }.map { it.toDailyWeather(parcelId) }
    // Get the current day weather
    var localDate = Calendar.getInstance()
    localDate.set(Calendar.HOUR_OF_DAY, 0)
    localDate.set(Calendar.MINUTE, 0)
    localDate.set(Calendar.SECOND, 0)
    val today = formatter.format(localDate.time)
    val todayWeather = dailyWeather[0].prediction.filter { it.date == today }
    dailyWeather[0].prediction = todayWeather
    // Set response back to exchange
    exchange.`in`.setBody(RequestOut(payload = dailyWeather[0]))
  }
}
