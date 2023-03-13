import io.minio.MinioClient
import javax.enterprise.context.ApplicationScoped

// Minio client configuration
class MinioConfig {
  @ApplicationScoped
  fun minioClient(): MinioClient {
    val minioClient =
        MinioClient.builder()
            .endpoint("http://localhost:9000")
            .credentials("minioadmin", "minioadmin")
            .build()
    return minioClient
  }
}
