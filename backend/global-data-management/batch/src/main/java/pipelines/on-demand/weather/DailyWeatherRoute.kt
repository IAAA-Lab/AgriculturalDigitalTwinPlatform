package weather.routes

import org.apache.camel.Exchange
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.jackson.JacksonDataFormat
import org.apache.camel.component.jackson.ListJacksonDataFormat
import org.apache.camel.model.dataformat.JsonLibrary
import weather.domain.*
import weather.dto.*
import weather.processors.*

class DailyWeatherRoute : RouteBuilder() {

        val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.routing_key}}"
        val AGROSLAB_URI = "{{agroslab.uri}}"
        val AGROSLAB_API_KEY = "{{agroslab.api_key}}"
        val MONGODB_QUERY_FINDONE =
                        "mongodb:camelMongoClient?database={{quarkus.mongodb.database}}&collection=Data&operation=findOneByQuery"
        val MONGODB_QUERY_INSERT =
                        "mongodb:camelMongoClient?database={{quarkus.mongodb.database}}&collection=Data&operation=insert"

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
                                .to(MONGODB_QUERY_FINDONE)
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
                                .unmarshal(
                                                ListJacksonDataFormat(
                                                                DailyWeatherAgroslabResp::class.java
                                                )
                                )
                                .wireTap("direct:save-to-data-lake")
                                .to("direct:process-web-service-response")

                from("direct:save-to-data-lake")
                                // camelMongoClient is a bean defined in the application.properties
                                // injected automatically by quarkus
                                // (quarkus.mongodb.connection-string)
                                .process { processSaveToDataLake(it) }
                                .to(MONGODB_QUERY_INSERT)
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
