import java.text.SimpleDateFormat
import org.apache.camel.Exchange
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.JacksonDataFormat
import org.apache.camel.component.jackson.ListJacksonDataFormat
import org.apache.camel.model.dataformat.JsonLibrary

data class RequestIn(val payload: DailyWeatherReq? = null)

data class RequestOut(val errorMessage: String? = null, val payload: DailyWeather? = null)

val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")

class DailyWeatherRoute : RouteBuilder() {

  val RABBIMQ_ROUTE =
      "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.routing_key}}&exchangePattern=inOnly"
  val AGROSLAB_URI = "{{agroslab.uri}}"
  val AGROSLAB_API_KEY = "{{agroslab.api_key}}"
  val MONGODB_QUERY =
      "mongodb:camelMongoClient?database={{quarkus.mongodb.database}}&collection=Data&operation=findOneByQuery"

  override fun configure() {

    // TODO: catch error
    // Consume request from RabbitMQ
    from(RABBIMQ_ROUTE)
        .log("Received request: \${body}")
        .setProperty("originRequest", body())
        .unmarshal(JacksonDataFormat(RequestIn::class.java))
        .process { saveParcelIdForLater(it) }
        .to("direct:request-to-data-lake")
        .choice()
        .`when`(body().isNull)
        .setBody(simple("\${exchangeProperty.originRequest}"))
        .unmarshal(JacksonDataFormat(RequestIn::class.java))
        .to("direct:request-to-web-service")
        .otherwise()
        .to("direct:process-data-lake-response")

    from("direct:request-to-data-lake")
        .process { setDataLakeQuery(it) }
        .to(MONGODB_QUERY)
        // Map bson document to DailyWeatherAgroslabResponse
        .marshal()
        .json(JsonLibrary.Jackson)
        .unmarshal(JacksonDataFormat(DailyWeatherDataLake::class.java))

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
        .wireTap("direct:save-to-data-lake")
        .to("direct:process-web-service-response")

    from("direct:save-to-data-lake")
        // camelMongoClient is a bean defined in the application.properties
        // injected automatically by quarkus (quarkus.mongodb.connection-string)
        .process { processSaveToDataLake(it) }
        .to("mongodb:camelMongoClient?database=test&collection=Data&operation=insert")
        .log("Saving to data lake ...")
        .stop()

    from("direct:process-web-service-response")
        .process { processAgroslabResponse(it) }
        .marshal(JacksonDataFormat(RequestOut::class.java))
        .log("Sending response to RabbitMQ ...")

    from("direct:process-data-lake-response")
        .process { processDataLakeResponse(it) }
        .marshal(JacksonDataFormat(RequestOut::class.java))
        .log("Sending response to RabbitMQ ...")
  }
}
