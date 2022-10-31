package eventhdl

// import (
// 	"digital-twin/main-server/src/internal/core/domain"
// 	"digital-twin/main-server/src/internal/core/ports"
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"reflect"
// 	"sync"
// 	"testing"

// 	"github.com/rabbitmq/amqp091-go"
// 	"github.com/stretchr/testify/assert"
// 	"github.com/stretchr/testify/mock"
// )

// type MockedBusRepository struct {
// 	wg sync.WaitGroup
// 	mock.Mock
// }

// func (m *MockedBusRepository) Subscribe(queueName string, exchangeName string, routingKey string, channel chan amqp091.Delivery) {
// 	m.wg.Add(1)
// 	defer m.wg.Done()
// 	m.Called(queueName, exchangeName, routingKey, channel)
// }

// func (m *MockedBusRepository) Publish(exchangeName string, routingKey string, message []byte) error {
// 	m.wg.Add(1)
// 	defer m.wg.Done()
// 	args := m.Called(exchangeName, routingKey, message)
// 	return args.Error(0)
// }

// type MockedParcelsService struct {
// 	mock.Mock
// 	ports.ParcelsService
// }

// func (m *MockedParcelsService) PostParcel(parcel domain.Parcel) error {
// 	args := m.Called(parcel)
// 	return args.Error(0)
// }

// func TestEventHandler_ParseExternalEvents(t *testing.T) {
// 	// Prepare data
// 	dataInRaw, err := ioutil.ReadFile("data-in.json")
// 	var dataIn domain.EventExtReceive
// 	json.Unmarshal(dataInRaw, &dataIn)
// 	if err != nil {
// 		t.Error("Error reading file")
// 	}
// 	// Prepare external event
// 	eventExtIn, err := json.Marshal(dataIn)
// 	if err != nil {
// 		t.Error("Error marshalling data")
// 	}
// 	// Simulate external event parsing
// 	eventExtOut, err := parseExternalEvents(amqp091.Delivery{Body: eventExtIn})
// 	if err != nil {
// 		t.Error("Error parsing external event: ", err)
// 	}
// 	// Assertions
// 	assert.True(t, reflect.DeepEqual(dataIn.Payload, eventExtOut.Payload), fmt.Sprintf("Expected: %v, got: %v", dataIn, eventExtOut))
// }

// func TestEventHandler_SendExternalEvents(t *testing.T) {
// 	// Prepare mocks
// 	bus := &MockedBusRepository{}
// 	mockedParcelssrv := &MockedParcelsService{}
// 	bus.On("Subscribe", mock.Anything, mock.Anything, mock.Anything, mock.Anything).Return()
// 	mockedParcelssrv.On("PostParcel", mock.Anything).Return(nil)
// 	// Instantiate event handler
// 	eventHandler := NewEventHandler(mockedParcelssrv, nil, bus)
// 	eventHandler.Start()
// 	// Prepare data
// 	parcelMarsh, err := json.Marshal(domain.Parcel{
// 		Id: "123",
// 	})
// 	if err != nil {
// 		t.Error("Error marshalling parcel")
// 	}
// 	// Prepare external event
// 	parcel := domain.EventExtReceive{
// 		ID:      "123",
// 		Payload: parcelMarsh,
// 	}
// 	eventExt, err := json.Marshal(parcel)
// 	if err != nil {
// 		t.Error("Error marshalling data")
// 	}
// 	// Simulate external event
// 	e := eventHandler.routingKeyMap[domain.EVENT_TYPE_PARCELS]
// 	e <- amqp091.Delivery{
// 		Body: eventExt,
// 	}
// 	bus.wg.Wait()
// 	bus.AssertExpectations(t)
// }
