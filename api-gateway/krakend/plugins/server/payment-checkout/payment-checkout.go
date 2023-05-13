package main

import (
	"context"
	"digital-twin/krakend/services"
	"errors"
	"net/http"
)

var pluginName = "payment-checkout"
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
	path := config["path"].(string)

	stripeStore := services.GetStoreInstance()
	stripeService := services.GetStripeInstance(stripeStore)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the path is protected
		if r.URL.Path == path {
			// Delegate payment to stripe
			session, err := stripeService.Checkout()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			http.Redirect(w, r, session.URL, http.StatusTemporaryRedirect)
			return
		}
		h.ServeHTTP(w, r)
	}), nil
}

func main() {}
