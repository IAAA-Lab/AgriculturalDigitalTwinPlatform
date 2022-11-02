package utils

import (
	"math"
	"regexp"
	"strings"

	"go.mongodb.org/mongo-driver/bson/primitive"
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

// ------- NOT WORKING YET --------

type filter struct {
	Key string `json:"key"`
	Op  string `json:"op,omitempty"`
	Val string `json:"val"`
}

type order struct {
	Key string `json:"key"`
	Dir string `json:"dir" default:"asc"`
}

type QueryString struct {
	Filters []filter `json:"filters"`
	Order   []order  `json:"order"`
	Limit   int      `json:"limit"`
	Offset  int      `json:"offset" default:"0"`
}

// NOTE: This function is only if it is more convenient to use the LHS bracket notation
// to parse the query string. It is not the case for the moment.
func LHSNotationToMongoDBAgregation(queryString string) ([]primitive.M, error) {
	// Parse query string using the LHS bracket notation
	params := strings.Split(queryString, "&")
	aggregation := []primitive.M{}
	for _, param := range params {
		matched := regexp.MustCompile(`^sort_by\[(.+)\]=asc|desc$`).MatchString(param)
		if matched {
			key := strings.Split(strings.Split(param, "[")[1], "]")[0]
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$sort": primitive.M{key: val}})
			continue
		}
		matched = regexp.MustCompile(`^(.+)\[lt|gt|lte|gte]=(.+)$`).MatchString(param)
		if matched {
			key := strings.Split(strings.Split(param, "[")[0], "]")[0]
			op := strings.Split(strings.Split(param, "[")[1], "]")[0]
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$match": primitive.M{key: primitive.M{op: val}}})
			continue
		}
		matched = regexp.MustCompile(`^(.+)[in]=(.+)$`).MatchString(param)
		if matched {
			key := strings.Split(param, "[")[0]
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$match": primitive.M{key: primitive.M{"$in": strings.Split(val, ",")}}})
			continue
		}
		matched = regexp.MustCompile(`^limit=(.+)$`).MatchString(param)
		if matched {
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$limit": val})
			continue
		}
		matched = regexp.MustCompile(`^offset=(.+)$`).MatchString(param)
		if matched {
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$skip": val})
			continue
		}
		matched = regexp.MustCompile(`^(.+)=(.+)$`).MatchString(param)
		if matched {
			key := strings.Split(param, "=")[0]
			val := strings.Split(param, "=")[1]
			aggregation = append(aggregation, primitive.M{"$match": primitive.M{key: val}})
			continue
		}
	}
	return aggregation, nil
}
