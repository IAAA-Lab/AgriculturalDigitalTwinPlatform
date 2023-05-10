package main

import (
	"context"
	"errors"
	"net/http"
	"os"
)

var pluginName = "api-key-auth"
var HandlerRegisterer = registerer(pluginName)

type registerer string

func (r registerer) RegisterHandlers(f func(
	name string,
	handler func(context.Context, map[string]interface{}, http.Handler) (http.Handler, error),
)) {
	f(string(r), r.registerHandlers)
}

func (r registerer) registerHandlers(_ context.Context, extra map[string]interface{}, h http.Handler) (http.Handler, error) {
	config, ok := extra[pluginName].(map[string]interface{})
	if !ok {
		return nil, errors.New("wrong config")
	}
	path, _ := config["paths"].(string)
	apiKey, _ := os.LookupEnv("API_KEY_DT")

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the path is protected
		// for _, path := range paths {
		if path == r.URL.Path {
			receivedApiKey := r.Header.Get("Authorization")
			// Check if the API key is valid
			if receivedApiKey != apiKey {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
		}
		// }
		h.ServeHTTP(w, r)

	}), nil
}

func main() {}
