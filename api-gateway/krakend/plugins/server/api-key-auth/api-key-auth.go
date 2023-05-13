package main

import (
	"context"
	"digital-twin/krakend/services"
	"errors"
	"fmt"
	"net/http"
	"regexp"
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

	stripeStore := services.GetStoreInstance()
	stripeService := services.GetStripeInstance(stripeStore)

	inputChan := createPoolOfGoroutines(WORKERS, stripeService)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the path is protected
		if protected_paths_regexp.MatchString(r.URL.Path) {
			receivedApiKey := r.Header.Get("Authorization")
			// Check API Key
			err := stripeService.CheckAuthorization(receivedApiKey)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			// Delegate payment to stripe in a goroutine
			inputChan <- receivedApiKey
			// Forward request
			w.WriteHeader(http.StatusOK)
		}
		h.ServeHTTP(w, r)
	}), nil
}

func main() {}

func paymentCountWorker(inputChan <-chan string, stripeService *services.StripeService) {
	for apiKey := range inputChan {
		err := stripeService.RecordUsage(apiKey)
		// TODO: Log error
		if err != nil {
			fmt.Println("[++++++] Stripe error: ", err)
		}
	}
}

func createPoolOfGoroutines(workers int, stripeService *services.StripeService) chan<- string {
	inputChan := make(chan string)
	// Create pool of stripe workers to handle payments asynchronously
	for i := 0; i < workers; i++ {
		go paymentCountWorker(inputChan, stripeService)
	}

	return inputChan
}
