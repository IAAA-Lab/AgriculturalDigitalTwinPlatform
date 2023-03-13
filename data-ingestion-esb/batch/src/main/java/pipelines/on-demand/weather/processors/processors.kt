package weather.processors

import com.mongodb.client.model.Filters
import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.camel.Exchange
import org.apache.camel.component.mongodb.MongoDbConstants
import weather.converters.*
import weather.domain.*
import weather.dto.*

val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")

fun saveParcelIdForLater(exchange: Exchange) {
  val parcelId = exchange.`in`.getBody(RequestIn::class.java).payload?.parcelId
  exchange.setProperty("parcelId", parcelId)
}

fun setDataLakeQuery(exchange: Exchange) {
  val parcelId = exchange.getProperty("parcelId") as String
  exchange.`in`.setHeader(
      MongoDbConstants.CRITERIA,
      Filters.and(Filters.eq("meta.type", "daily_weather"), Filters.eq("meta.parcelId", parcelId))
  )
}

fun processAgroslabRequest(exchange: Exchange) {
  val request = exchange.`in`.getBody(RequestIn::class.java)
  println("Processing request: $request")
  val agroslabRequest = request.payload?.toAgroslabRequest()
  exchange.`in`.setBody(agroslabRequest, AgroslabRequest::class.java)
}

fun processAgroslabResponse(exchange: Exchange) {
  val payload = exchange.`in`.getBody(List::class.java)
  val parcelId = exchange.`in`.exchange.getProperty("parcelId") as String
  var dailyWeather =
      payload.map { it as DailyWeatherAgroslabResp }.map { it.toDailyWeather(parcelId) }
  // Get the current day weather
  var localDate = Calendar.getInstance()
  localDate.set(Calendar.HOUR_OF_DAY, 0)
  localDate.set(Calendar.MINUTE, 0)
  localDate.set(Calendar.SECOND, 0)
  val today = formatter.format(localDate.time)
  val todayWeather = dailyWeather[0].prediction.filter { it.date == today }
  dailyWeather[0].prediction = todayWeather
  // Set response back to exchange
  exchange.`in`.setBody(RequestOut(payload = dailyWeather[0]))
}

fun processDataLakeResponse(exchange: Exchange) {
  val body = exchange.`in`.getBody(DailyWeatherDataLake::class.java).data
  val parcelId = exchange.`in`.exchange.getProperty("parcelId") as String
  val dailyWeather = body.toDailyWeather(parcelId)
  // Set response back to exchange
  exchange.`in`.setBody(RequestOut(payload = dailyWeather))
}

fun processSaveToDataLake(exchange: Exchange) {
  val payload = exchange.`in`.getBody(List::class.java) as List<DailyWeatherAgroslabResp>
  val parcelId = exchange.`in`.exchange.getProperty("parcelId") as String
  val dailyWeather =
      DailyWeatherDataLake(
          meta = Meta(parcelId = parcelId, type = "daily_weather"),
          data = payload[0]
      )
  exchange.`in`.setBody(dailyWeather)
}
