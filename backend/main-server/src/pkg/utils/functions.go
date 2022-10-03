package utils

import (
	"math"
	"strings"
)

func EscapeHTMLBack(s string) string {
	s = strings.Replace(s, "&amp;", "&", -1)
	s = strings.Replace(s, "&lt;", "<", -1)
	s = strings.Replace(s, "&gt;", ">", -1)
	s = strings.Replace(s, "&quot;", "\"", -1)
	s = strings.Replace(s, "&#39;", "'", -1)
	return s
}

func RoundDecimals(num float32) float32 {
	return float32(math.Floor(float64(num)*100) / 100)
}
