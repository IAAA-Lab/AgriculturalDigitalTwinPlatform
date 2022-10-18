package eventhdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"log"
	"time"

	"github.com/goccy/go-json"
	"github.com/rabbitmq/amqp091-go"
)

type EventHandler struct {
	parcelsService ports.ParcelsService
	memoryStorage  ports.CacheService
	eventsBus      ports.BusRepository
	eventsInInt    chan domain.EventIn
	routingKeyMap  map[string]chan amqp091.Delivery
}

func NewEventHandler(parcelsService ports.ParcelsService, memoryStorage ports.CacheService, eventsBus ports.BusRepository) *EventHandler {
	return &EventHandler{
		parcelsService: parcelsService,
		memoryStorage:  memoryStorage,
		eventsBus:      eventsBus,
		eventsInInt:    make(chan domain.EventIn, 100),
		routingKeyMap: map[string]chan amqp091.Delivery{
			domain.EVENT_TYPE_PARCELS:          make(chan amqp091.Delivery, 50),
			domain.EVENT_TYPE_DAILY_WEATHER:    make(chan amqp091.Delivery, 50),
			domain.EVENT_TYPE_FORECAST_WEATHER: make(chan amqp091.Delivery, 50),
			domain.EVENT_TYPE_NDVI:             make(chan amqp091.Delivery, 50),
			domain.EVENT_TYPE_NDVI_MAP:         make(chan amqp091.Delivery, 50),
		},
	}
}

// Starts the event handler by listening to external events and internal events
func (h *EventHandler) Start() {
	// Open a goroutine for each consumer type
	for routingKey, channel := range h.routingKeyMap {
		go h.eventsBus.Subscribe("event_handler", "digital_twin", routingKey, channel)
	}
	go func() {
		for {
			select {
			case msgInt := <-h.eventsInInt:
				h.handleInternalEvents(msgInt)
			case msgParcels := <-h.routingKeyMap[domain.EVENT_TYPE_PARCELS]:
				eventExt, err := parseExternalEvents(msgParcels)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				var parcel domain.Parcel
				err = json.Unmarshal(eventExt.Payload, &parcel)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				// Supposed that one parcel is sent at a time
				h.parcelsService.PostParcel(parcel)

			case msgDailyWeather := <-h.routingKeyMap[domain.EVENT_TYPE_DAILY_WEATHER]:
				eventExt, err := parseExternalEvents(msgDailyWeather)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				var dailyWeather []domain.DailyWeather
				err = json.Unmarshal(eventExt.Payload, &dailyWeather)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostDailyWeather(dailyWeather)
				h.sendBackToChannel(eventExt)

			case msgForecastWeather := <-h.routingKeyMap[domain.EVENT_TYPE_FORECAST_WEATHER]:
				eventExt, err := parseExternalEvents(msgForecastWeather)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				var forecastWeather []domain.ForecastWeather
				err = json.Unmarshal(eventExt.Payload, &forecastWeather)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostForecastWeather(forecastWeather)
				h.sendBackToChannel(eventExt)

			case msgNDVI := <-h.routingKeyMap[domain.EVENT_TYPE_NDVI]:
				eventExt, err := parseExternalEvents(msgNDVI)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				var ndvi []domain.NDVI
				err = json.Unmarshal(eventExt.Payload, &ndvi)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostNDVI(ndvi)
				h.sendBackToChannel(eventExt)

			case msgNDVIMap := <-h.routingKeyMap[domain.EVENT_TYPE_NDVI_MAP]:
				eventExt, err := parseExternalEvents(msgNDVIMap)
				if err != nil {
					log.Println("Error parsing external event: ", err)
					continue
				}
				// The NDVI map is not saved in the local database
				h.sendBackToChannel(eventExt)
			}
		}
	}()
}

// Returns the channel where internal events are received
func (h *EventHandler) GetIntChannel() chan<- domain.EventIn {
	return h.eventsInInt
}

func (h *EventHandler) handleInternalEvents(msgInt domain.EventIn) {
	// Prepare the event to be sent
	msgToCache, err1 := json.Marshal(msgInt)
	msgToSend, err2 := json.Marshal(domain.EventExtSend{
		ID:      msgInt.ID.String(),
		Payload: msgInt.Payload,
	})
	// Catch errors
	if err1 != nil || err2 != nil {
		fmt.Println("Error marshalling event")
		msgInt.Channel <- domain.EventOut{
			ErrorMessage: apperrors.ErrInvalidInput.Error(),
			Payload:      nil,
		}
		return
	}
	// Send message to the external broker
	h.eventsBus.Publish("digital_twin", msgInt.EventType, msgToSend)
	// Save event in cache
	h.memoryStorage.Set(msgInt.ID.String(), string(msgToCache), 5*time.Minute)
}

func parseExternalEvents(msgExt amqp091.Delivery) (domain.EventExtReceive, error) {
	// Parse external event
	var eventExt domain.EventExtReceive
	err := json.Unmarshal(msgExt.Body, &eventExt)
	return eventExt, err
}

func (h *EventHandler) sendBackToChannel(eventExt domain.EventExtReceive) {
	// Get event from memory by the event ID
	eventSavedRaw, err := h.memoryStorage.Get(eventExt.ID)
	errMsg := ""
	if err != nil {
		errMsg = "Error getting event from cache: " + err.Error()
	}
	// Parse event
	var eventSaved domain.EventIn
	err = json.Unmarshal([]byte(eventSavedRaw), &eventSaved)
	if err != nil {
		errMsg = "Error getting event from cache: " + err.Error()
	}
	// Send response to the controller
	eventSaved.Channel <- domain.EventOut{
		ErrorMessage: errMsg,
		Payload:      eventExt.Payload,
	}
}
