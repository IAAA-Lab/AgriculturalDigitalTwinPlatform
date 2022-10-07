package eventhdl

import (
	"digital-twin/main-server/src/internal/core/ports"
	"fmt"

	"github.com/rabbitmq/amqp091-go"
)

type EventHandler struct {
	memoryStorage ports.CacheService
	eventsInExt   ports.BrokerRepository
	eventsInInt   chan interface{}
}

func NewEventHandler(memoryStorage ports.CacheService, eventsIn ports.BrokerRepository) *EventHandler {
	return &EventHandler{
		memoryStorage: memoryStorage,
		eventsInExt:   eventsIn,
		eventsInInt:   make(chan interface{}),
	}
}

func (h *EventHandler) Start() {
	out := make(chan amqp091.Delivery)
	go h.eventsInExt.Subscribe("pepe", "digital_twin", "", out)
	go func() {
		for {
			select {
			case msg := <-out:
				fmt.Println("Received message: ", string(msg.Body))
			}
		}
	}()
}

func (h *EventHandler) GetChannel() chan<- interface{} {
	return h.eventsInInt
}
