import org.apache.camel.builder.RouteBuilder

class FetchPistachoJSON : RouteBuilder() {

  override fun configure() {
    from("file:files/input").to("file:files/output")
  }
}
