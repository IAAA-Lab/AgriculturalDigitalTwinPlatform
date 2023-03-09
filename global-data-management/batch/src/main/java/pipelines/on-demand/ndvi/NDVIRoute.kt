// import javax.inject.Inject
// import ndvi.dto.*
// import ndvi.processors.*
// import org.apache.camel.Exchange
// import org.apache.camel.builder.RouteBuilder
// import org.apache.camel.component.jackson.JacksonDataFormat
// import org.apache.camel.model.dataformat.JsonLibrary

// class NDVIRoute : RouteBuilder() {

//         @Inject lateinit var selfSignedHttpClientConfigurer: SelfSignedHttpClientConfigurer

//         val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.ndvi.routing_key}}"
//         val AGROSLAB_URI = "{{agroslab.teledetection.uri}}"
//         val AGROSLAB_API_KEY = "{{agroslab.api_key}}"

//         override fun configure() {

//                 // TODO: catch error
//                 // Consume request from RabbitMQ
//                 from(RABBIMQ_ROUTE)
//                                 .log("Received request: \${body}")
//                                 .setProperty("originRequest", body())
//                                 .unmarshal(JacksonDataFormat(RequestIn::class.java))
//                                 .to("direct:ndvi-request-to-web-service")

//                 from("direct:ndvi-request-to-web-service")
//                                 .process { processAgroslabRequest(it) }
//                                 .marshal(JacksonDataFormat(AgroslabRequest::class.java))
//                                 // Call Agroslab API
//                                 .setHeader("Accept", constant("application/json"))
//                                 .setHeader("Authorization", constant(AGROSLAB_API_KEY))
//                                 .setHeader(Exchange.HTTP_METHOD, constant("POST"))
//                                 .to(AGROSLAB_URI)
//                                 // Process response and send to RabbitMQ
//                                 .log("message: \${body}")
//                                 .unmarshal()
//                                 .json(JsonLibrary.Jackson)
//                                 .to("direct:ndvi-process-web-service-response")

//                 from("direct:ndvi-process-web-service-response")
//                                 .process { processAgroslabResponse(it) }
//                                 .marshal(JacksonDataFormat(RequestOut::class.java))
//                                 .log("Sending response to RabbitMQ ...")
//         }
// }
