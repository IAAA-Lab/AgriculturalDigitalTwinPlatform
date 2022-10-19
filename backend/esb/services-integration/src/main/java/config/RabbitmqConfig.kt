import com.rabbitmq.client.ConnectionFactory
import javax.enterprise.context.ApplicationScoped
import javax.enterprise.inject.Produces

// Same as Spring @Configuration
@ApplicationScoped
class RabbitmqConfig {

    // Same as Spring @Bean
    @Produces
    @ApplicationScoped
    fun connectionFactory(): ConnectionFactory {
        val factory = ConnectionFactory()
        factory.host = System.getenv("QUARKUS_RABBITMQ_HOST") ?: "localhost"
        factory.port = System.getenv("QUARKUS_RABBITMQ_PORT")?.toInt() ?: 5672
        factory.username = System.getenv("QUARKUS_RABBITMQ_USERNAME") ?: "guest"
        factory.password = System.getenv("QUARKUS_RABBITMQ_PASSWORD") ?: "guest"
        return factory
    }
}
