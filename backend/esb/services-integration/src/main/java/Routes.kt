import org.apache.camel.LoggingLevel
import org.apache.camel.builder.RouteBuilder
import org.apache.camel.model.rest.RestBindingMode

class Routes : RouteBuilder() {

    override fun configure() {
        restConfiguration().bindingMode(RestBindingMode.json)

        rest("/pokemon")
                .get()
                .to("direct:greet")

        from("direct:greet")
                .setBody(constant("Hello World"));
    }

}