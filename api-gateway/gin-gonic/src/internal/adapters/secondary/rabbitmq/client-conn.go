package rabbitmq

import (
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQConn struct {
	conn *amqp.Connection
}

func NewRabbitMQConn(url string) *RabbitMQConn {
	conn, err := amqp.Dial(url)
	if err != nil {
		panic(err)
	}
	return &RabbitMQConn{conn}
}
