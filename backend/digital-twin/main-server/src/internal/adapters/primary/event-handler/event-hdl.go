package eventhdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"
	"fmt"
	"time"

	"github.com/goccy/go-json"
	"github.com/rabbitmq/amqp091-go"
)

type EventHandler struct {
	parcelsService ports.ParcelsService
	memoryStorage  ports.CacheService
	eventsInExt    ports.BusRepository
	eventsInInt    chan domain.EventIn
}

func NewEventHandler(parcelsService ports.ParcelsService, memoryStorage ports.CacheService, eventsIn ports.BusRepository) *EventHandler {
	return &EventHandler{
		parcelsService: parcelsService,
		memoryStorage:  memoryStorage,
		eventsInExt:    eventsIn,
		eventsInInt:    make(chan domain.EventIn, 100),
	}
}

var routingKeyMap = map[string]chan amqp091.Delivery{
	domain.EVENT_TYPE_PARCELS:          make(chan amqp091.Delivery, 50),
	domain.EVENT_TYPE_DAILY_WEATHER:    make(chan amqp091.Delivery, 50),
	domain.EVENT_TYPE_FORECAST_WEATHER: make(chan amqp091.Delivery, 50),
	domain.EVENT_TYPE_NDVI:             make(chan amqp091.Delivery, 50),
	domain.EVENT_TYPE_NDVI_MAP:         make(chan amqp091.Delivery, 50),
}

// Starts the event handler by listening to external events and internal events
func (h *EventHandler) Start() {
	// Open a goroutine for each consumer type
	for routingKey, channel := range routingKeyMap {
		go h.eventsInExt.Subscribe("event_handler", "digital_twin", routingKey, channel)
	}
	go func() {
		for {
			select {
			case msgInt := <-h.eventsInInt:
				h.handleInternalEvents(msgInt)
			case msgParcels := <-routingKeyMap[domain.EVENT_TYPE_PARCELS]:
				eventExt, err := h.parseExternalEvents(msgParcels)
				if err != nil {
					fmt.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostParcels(eventExt.Payload.(domain.Parcel))

			case msgDailyWeather := <-routingKeyMap[domain.EVENT_TYPE_DAILY_WEATHER]:
				eventExt, err := h.parseExternalEvents(msgDailyWeather)
				if err != nil {
					fmt.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostDailyWeather(eventExt.Payload.([]domain.DailyWeather))
				h.sendBackToChannel(eventExt)

			case msgForecastWeather := <-routingKeyMap[domain.EVENT_TYPE_FORECAST_WEATHER]:
				eventExt, err := h.parseExternalEvents(msgForecastWeather)
				if err != nil {
					fmt.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostForecastWeather(eventExt.Payload.([]domain.ForecastWeather))
				h.sendBackToChannel(eventExt)

			case msgNDVI := <-routingKeyMap[domain.EVENT_TYPE_NDVI]:
				eventExt, err := h.parseExternalEvents(msgNDVI)
				if err != nil {
					fmt.Println("Error parsing external event: ", err)
					continue
				}
				h.parcelsService.PostNDVI(eventExt.Payload.([]domain.NDVI))
				h.sendBackToChannel(eventExt)

			case msgNDVIMap := <-routingKeyMap[domain.EVENT_TYPE_NDVI_MAP]:
				eventExt, err := h.parseExternalEvents(msgNDVIMap)
				if err != nil {
					fmt.Println("Error parsing external event: ", err)
					continue
				}
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
	fmt.Println("Received internal event: ", msgInt)
	msgToSend, err := json.Marshal(msgInt)
	if err != nil {
		fmt.Println("Error marshalling event: ", err)
		msgInt.Channel <- domain.EventOut{
			ErrorMessage: apperrors.ErrInvalidInput.Error(),
			Payload:      "",
		}
		return
	}
	// Send message to the external broker
	h.eventsInExt.Publish("digital_twin", msgInt.EventType, msgToSend)
	// Save event in cache
	h.memoryStorage.Set(msgInt.ID.String(), string(msgToSend), 5*time.Minute)
}

func (h *EventHandler) parseExternalEvents(msgExt amqp091.Delivery) (domain.EventExt, error) {
	fmt.Println("Received external event: ", string(msgExt.Body))
	// Parse external event
	var eventExt domain.EventExt
	err := json.Unmarshal(msgExt.Body, &eventExt)
	return eventExt, err
}

func (h *EventHandler) sendBackToChannel(eventExt domain.EventExt) {
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
