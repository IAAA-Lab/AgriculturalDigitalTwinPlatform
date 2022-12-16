// Create HTTP client with none SSL support
// Path: src/main/java/config/SSLConfig.kt

import javax.enterprise.context.ApplicationScoped
import org.apache.camel.component.http.HttpClientConfigurer
import org.apache.http.conn.ssl.NoopHostnameVerifier
import org.apache.http.impl.client.HttpClientBuilder
import org.apache.http.ssl.SSLContextBuilder

class SelfSignedHttpClientConfigurer : HttpClientConfigurer {

  @ApplicationScoped
  override fun configureHttpClient(clientBuilder: HttpClientBuilder) {
    val sslContext = SSLContextBuilder().loadTrustMaterial(null) { _, _ -> true }.build()
    clientBuilder.setSSLContext(sslContext)
    clientBuilder.setSSLHostnameVerifier(NoopHostnameVerifier())
  }
}
