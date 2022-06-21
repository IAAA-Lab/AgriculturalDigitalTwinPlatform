package utils

import (
	"fmt"
	"strings"
)

func EscapeHTMLBack(s string) string {
	s = strings.Replace(s, "&amp;", "&", -1)
	s = strings.Replace(s, "&lt;", "<", -1)
	s = strings.Replace(s, "&gt;", ">", -1)
	s = strings.Replace(s, "&quot;", "\"", -1)
	s = strings.Replace(s, "&#39;", "'", -1)
	fmt.Println(s)
	return s
}
