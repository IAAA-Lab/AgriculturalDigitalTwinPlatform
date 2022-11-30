import org.apache.camel.builder.RouteBuilder

class ParcelsRouter : RouteBuilder() {
  val FILE_URI = "file:files/input?noop=true&initialDelay=2000"
  val AGROSLAB_URI = "{{agroslab.uri}}"
  val AGROSLAB_API_KEY = "{{agroslab.api_key}}"
  val MONGODB_QUERY_FINDONE =
      "mongodb:camelMongoClient?database={{quarkus.mongodb.database}}&collection=Data&operation=findOneByQuery"
  val MONGODB_QUERY_INSERT =
      "mongodb:camelMongoClient?database={{quarkus.mongodb.database}}&collection=Data&operation=insert"

  override fun configure() {
    from(FILE_URI).log("Cuerpo \${body}")
  }
}
