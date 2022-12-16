package ndvi.domain

import java.util.Calendar

data class NDVI(
    val enclosureId: String = "",
    val date: Calendar = Calendar.getInstance(),
    val ndvi: Double = 0.0,
)
