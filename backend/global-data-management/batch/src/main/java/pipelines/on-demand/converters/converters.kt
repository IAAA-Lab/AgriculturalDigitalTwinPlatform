package ndvi.processors

import java.util.Calendar
import ndvi.dto.AgroslabRequest
import ndvi.dto.NDVIReq

fun NDVIReq.toAgroslabRequest(): AgroslabRequest {
  return AgroslabRequest(
      initdate = startDate.toAgroslabDate(),
      enddate = endDate.toAgroslabDate(),
      id = enclosureIds[0],
  )
}

private fun Calendar.toAgroslabDate(): String {
  val year = get(Calendar.YEAR)
  val month = get(Calendar.MONTH) + 1
  val day = get(Calendar.DAY_OF_MONTH)
  return "$day-$month-$year"
}
