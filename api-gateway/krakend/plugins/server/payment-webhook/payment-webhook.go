package main

import (
	"context"
	"digital-twin/krakend/services"
	"errors"
	"io/ioutil"
	"net/http"
	"os"
)

var pluginName = "payment-webhook"
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
	webhookSecret, found := os.LookupEnv("STRIPE_WEBHOOK_SECRET")
	if !found {
		return nil, errors.New("stripe webhook secret not found")
	}
	const MaxBodyBytes = int64(65536)

	stripeStore := services.GetStoreInstance()
	stripeService := services.GetStripeInstance(stripeStore)
	emailService := services.GetEmailSenderInstance()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the path is protected
		if r.URL.Path == path && r.Method == "POST" {
			// Delegate payment to stripe
			r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
			payload, err := ioutil.ReadAll(r.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			stripeSignature := r.Header.Get("stripe-signature")
			err = stripeService.ManageWebhook(webhookSecret, stripeSignature, payload, emailService)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			return
		}
		h.ServeHTTP(w, r)
	}), nil
}
