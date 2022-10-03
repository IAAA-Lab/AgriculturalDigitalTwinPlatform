package rabbitmqrepo

import (
	"context"

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

func (r *RabbitMQConn) Close() {
	r.conn.Close()
}

func (r *RabbitMQConn) GetChannel() *amqp.Channel {
	ch, err := r.conn.Channel()
	if err != nil {
		panic(err)
	}
	return ch
}

func (r *RabbitMQConn) GetQueue(name string) *amqp.Queue {
	ch := r.GetChannel()
	defer ch.Close()
	q, err := ch.QueueDeclare(
		name,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	return &q
}

func (r *RabbitMQConn) GetQueueBindedToExchange(queueName string, exchangeName string) *amqp.Queue {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueue(queueName)
	err := ch.QueueBind(
		q.Name,
		"",
		exchangeName,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	return q
}

func (r *RabbitMQConn) GetQueueBindedToExchangeWithRoutingKey(queueName string, exchangeName string, routingKey string) *amqp.Queue {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueue(queueName)
	err := ch.QueueBind(
		q.Name,
		routingKey,
		exchangeName,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	return q
}

func (r *RabbitMQConn) Consume(queueName string, consumerName string) <-chan amqp.Delivery {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueue(queueName)
	msgs, err := ch.Consume(
		q.Name,
		consumerName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	return msgs
}

func (r *RabbitMQConn) ConsumeBindedToExchange(queueName string, exchangeName string, consumerName string) <-chan amqp.Delivery {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueueBindedToExchangeWithRoutingKey(queueName, exchangeName, "")
	msgs, err := ch.Consume(
		q.Name,
		consumerName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	return msgs
}

func (r *RabbitMQConn) Publish(exchangeName string, routingKey string, body []byte) {
	ch := r.GetChannel()
	defer ch.Close()
	err := ch.PublishWithContext(
		context.TODO(),
		exchangeName,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:     "application/json",
			Body:            body,
			ContentEncoding: "utf-8",
		},
	)

	if err != nil {
		panic(err)
	}
}
