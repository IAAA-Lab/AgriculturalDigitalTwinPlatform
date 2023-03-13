import javax.enterprise.context.ApplicationScoped
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory

// Same as Spring @Configuration
class RabbitmqConfig {

    // Same as Spring @Bean
    // TODO: Make a more complex factory with custom thread pool when needed
    @ApplicationScoped
    fun connectionFactory(): CachingConnectionFactory {
        val factory = CachingConnectionFactory()
        factory.host = "localhost"
        factory.port = 5672
        return factory
    }
}
