package ndvi.dto

import java.util.Calendar
import ndvi.domain.NDVI

data class NDVIReq(
                val enclosureIds: List<String> = listOf(),
                val startDate: Calendar = Calendar.getInstance(),
                val endDate: Calendar = Calendar.getInstance(),
)

data class AgroslabRequest(
                val operation: String = "getndviindexmeanvaluezone",
                val initdate: String = "",
                val enddate: String = "",
                val id: String = "",
)

data class RequestIn(val payload: NDVIReq? = null)

data class RequestOut(val errorMessage: String? = null, val payload: List<NDVI>? = null)
