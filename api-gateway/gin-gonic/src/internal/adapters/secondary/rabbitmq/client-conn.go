package rabbitmq

import (
	amqp "github.com/rabbitmq/amqp091-go"
	"fmt"
)

type RabbitMQConn struct {
	conn *amqp.Connection
}

func NewRabbitMQConn(url string) *RabbitMQConn {
	conn, err := amqp.Dial(url)
	if err != nil {
		fmt.Println("Rabbitmq failed connection")
	}
	return &RabbitMQConn{conn}
}
