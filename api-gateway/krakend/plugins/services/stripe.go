package services

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/checkout/session"
	"github.com/stripe/stripe-go/v74/subscription"
	"github.com/stripe/stripe-go/v74/usagerecord"
	"github.com/stripe/stripe-go/v74/webhook"
	"golang.org/x/crypto/bcrypt"
)

type StripeService struct {
	stripeStore *StoreSingleton
}

func GetStripeInstance(stripeStore *StoreSingleton) *StripeService {
	stripe.Key = os.Getenv("STRIPE_KEY")
	return &StripeService{
		stripeStore: stripeStore,
	}
}

func (ss *StripeService) Checkout() (*stripe.CheckoutSession, error) {
	params := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{
			"card",
		}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price: stripe.String(os.Getenv("STRIPE_PRICE_ID")),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL: stripe.String("http://localhost:8080/success"),
		CancelURL:  stripe.String("http://localhost:8080/cancel"),
	}
	return session.New(params)
}

func (ss *StripeService) CheckAuthorization(receivedApiKey string) error {
	customerInfo, err := ss.stripeStore.Get(receivedApiKey)
	if err != nil {
		return err
	}
	// Check if API key is active
	if !customerInfo.Active {
		return errors.New("api key not active")
	}
	// Check if hash of received API key matches hash of stored API key
	if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword([]byte(customerInfo.ApiKeyHash), []byte(receivedApiKey))
	if err != nil {
		return errors.New("api key not valid")
	}
	return nil
}

func (ss *StripeService) ManageWebhook(webhookSecret string, stripeSignature string, body []byte) (string, error) {
	stripe.Key = os.Getenv("STRIPE_KEY")
	event, err := webhook.ConstructEvent(body, stripeSignature, webhookSecret)
	if err != nil {
		return "", err
	}
	switch event.Type {
	case "checkout.session.completed":
		costumerId := event.Data.Object["customer"].(string)
		subscriptionId := event.Data.Object["subscription"].(string)
		fmt.Fprintf(os.Stdout, "Customer %s subscribed with subscription %s\n", costumerId, subscriptionId)
		// Retrieve customer subscription
		subscription, err := subscription.Get(subscriptionId, nil)
		if err != nil {
			return "", err
		}
		itemId := subscription.Items.Data[0].ID
		// Generate random API key and hash it to store in store
		randomApiKey := generateRandomApiKey(32)
		fmt.Println("[******] random api key: ", randomApiKey)
		apiKeyHashed, err := bcrypt.GenerateFromPassword([]byte(randomApiKey), bcrypt.DefaultCost)
		if err != nil {
			return "", err
		}
		// Store API key in store
		ss.stripeStore.Set(randomApiKey, StripeStore{
			ApiKeyHash: string(apiKeyHashed),
			CustomerId: costumerId,
			ItemId:     itemId,
			Active:     true,
		})
		return randomApiKey, nil
	case "invoice.paid":
		break
	case "invoice.payment_failed":
		break
	}
	return "", errors.New("stripe event not found - " + event.Type)
}

func (ss *StripeService) RecordUsage(apiKey string) error {
	// Retrieve customer info from store
	customerInfo, err := ss.stripeStore.Get(apiKey)
	if err != nil {
		return err
	}
	if !customerInfo.Active {
		return errors.New("stripe customer not active")
	}
	// Record usage with Stripe billing
	params := &stripe.UsageRecordParams{
		Quantity:         stripe.Int64(1),
		SubscriptionItem: stripe.String(customerInfo.ItemId),
		Timestamp:        stripe.Int64(time.Now().Unix()),
		Action:           stripe.String(stripe.UsageRecordActionIncrement),
	}
	_, err = usagerecord.New(params)
	return err
}

func generateRandomApiKey(keyLength int) string {
	b := make([]byte, keyLength)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}
