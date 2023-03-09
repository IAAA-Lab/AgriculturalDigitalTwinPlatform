import org.apache.camel.builder.RouteBuilder
import org.apache.camel.component.minio.MinioConstants

class FetchPistachoJSON : RouteBuilder() {

  val minioBucket = "landing-zone"

  // TODO: Store it in minio
  override fun configure() {
    from("file:files/input")
        .setHeader(MinioConstants.OBJECT_NAME, simple("\${file:name}"))
        .to("minio:$minioBucket?autoCreateBucket=true")
        .log("File \${file:name} has been uploaded to MinIO")
  }
}
