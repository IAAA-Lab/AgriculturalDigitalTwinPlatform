package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"time"
)

var pluginName = "api-key-auth"
var HandlerRegisterer = registerer(pluginName)

const WORKERS = 5

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
	protected_paths, _ := config["protected_paths_regexp"].(string)
	protected_paths_regexp := regexp.MustCompile(protected_paths)
	apiKey := os.Getenv("API_KEY_DT")

	inputChan := createPoolOfGoroutines(WORKERS)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the path is protected
		if protected_paths_regexp.MatchString(r.URL.Path) {
			receivedApiKey := r.Header.Get("Authorization")
			// Check if the API key is valid
			if receivedApiKey != apiKey {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			// Delegate payment to stripe in a goroutine
			inputChan <- "payment"
			return

		}
		h.ServeHTTP(w, r)

	}), nil
}

func main() {}

func stripeCountWorker(inputChan <-chan string) {
	// Call Stripe endpoint
	time.Sleep(2 * time.Second)
	fmt.Println("Stripe payment done")
	// Log the result

}

func createPoolOfGoroutines(workers int) chan<- string {
	inputChan := make(chan string)

	for i := 0; i < workers; i++ {
		go stripeCountWorker(inputChan)
	}

	return inputChan
}
