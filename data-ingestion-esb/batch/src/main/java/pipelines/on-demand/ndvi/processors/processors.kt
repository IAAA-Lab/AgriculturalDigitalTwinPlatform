package ndvi.processors

import ndvi.domain.NDVI
import ndvi.dto.AgroslabRequest
import ndvi.dto.RequestIn
import ndvi.dto.RequestOut
import org.apache.camel.Exchange

fun processAgroslabRequest(exchange: Exchange) {
  val request = exchange.`in`.getBody(RequestIn::class.java)
  println("Processing request: $request")
  val agroslabRequest = request.payload?.toAgroslabRequest()
  println("Sending request to Agroslab: $agroslabRequest")
  exchange.`in`.setBody(agroslabRequest, AgroslabRequest::class.java)
}

fun processAgroslabResponse(exchange: Exchange) {
  val agroslabResponse = exchange.`in`.getBody(String::class.java)
  println("Processing response: $agroslabResponse")
  val response: List<NDVI>? = mutableListOf()
  exchange.`in`.setBody(RequestOut(payload = response))
}
