package eventhdl

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"fmt"
	"time"

	"github.com/goccy/go-json"
	"github.com/rabbitmq/amqp091-go"
)

type EventHandler struct {
	memoryStorage ports.CacheService
	eventsInExt   ports.BrokerRepository
	eventsInInt   chan domain.EventIn
}

func NewEventHandler(memoryStorage ports.CacheService, eventsIn ports.BrokerRepository) *EventHandler {
	return &EventHandler{
		memoryStorage: memoryStorage,
		eventsInExt:   eventsIn,
		eventsInInt:   make(chan domain.EventIn, 50),
	}
}

// Starts the event handler by listening to external events and internal events
func (h *EventHandler) Start() {
	out := make(chan amqp091.Delivery)
	go h.eventsInExt.Subscribe("event_handler", "digital_twin", "", out)
	go func() {
		for {
			select {
			case msgExt := <-out:
				h.handleExternalEvents(msgExt)
			case msgInt := <-h.eventsInInt:
				h.handleInternalEvents(msgInt)
			}
		}
	}()
}

// Returns the channel where internal events are received
func (h *EventHandler) GetIntChannel() chan<- domain.EventIn {
	return h.eventsInInt
}

func (h *EventHandler) handleExternalEvents(msgExt amqp091.Delivery) {
	fmt.Println("Received external event: ", string(msgExt.Body))
	// Parse external event
	var eventExt domain.EventExt
	err := json.Unmarshal(msgExt.Body, &eventExt)
	eventSavedRaw, err := h.memoryStorage.Get(eventExt.ID)
	errMsg := ""
	if err != nil {
		errMsg = "Error getting event from cache: " + err.Error()
	}
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

func (h *EventHandler) handleInternalEvents(msgInt domain.EventIn) {
	fmt.Println("Received internal event: ", msgInt)
	msgToSend, err := json.Marshal(msgInt)
	if err != nil {
		fmt.Println("Error marshalling event: ", err)
		msgInt.Channel <- domain.EventOut{
			ErrorMessage: "Bad request",
			Payload:      "",
		}
		return
	}
	// Send message to the external broker
	h.eventsInExt.Publish("digital_twin", "", msgToSend)
	// Save event in cache
	h.memoryStorage.Set(msgInt.ID.String(), string(msgToSend), 5*time.Minute)
}
