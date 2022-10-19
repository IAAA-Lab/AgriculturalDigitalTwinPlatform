package testing

import io.quarkus.test.junit.QuarkusTest
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test

// Got to put tests under src/test/java in order to be picked up by Quarkus

@QuarkusTest
class DailyWeatherTest {

    @Test
    fun testHelloEndpoint() {
        Assertions.assertTrue(true)
    }
}
