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
		false,
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

// func (r *RabbitMQConn) Subscribe(queueName string, consumerName string) (<-chan interface{}, error) {
// 	ch := r.GetChannel()
// 	defer ch.Close()
// 	q := r.GetQueue(queueName)
// 	msgs, err := ch.Consume(
// 		q.Name,
// 		consumerName,
// 		true,
// 		false,
// 		false,
// 		false,
// 		nil,
// 	)
// 	// Wrap channel to adapt to Repository interface
// 	p := make(chan interface{})
// 	// go func() {
// 	// 	for d := range msgs {
// 	// 		p <- d
// 	// 	}
// 	// }()
// 	p <- msgs
// 	fmt.Println(p)
// 	return p, err
// }

func (r *RabbitMQConn) Subscribe(queueName string, exchangeName string, routingKey string, out chan amqp.Delivery) {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueueBindedToExchangeWithRoutingKey(queueName, exchangeName, routingKey)
	h, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		panic(err)
	}
	for d := range h {
		out <- d
	}
}

func (r *RabbitMQConn) Publish(topic string, routingKey string, message []byte) error {
	ch := r.GetChannel()
	defer ch.Close()
	err := ch.PublishWithContext(
		context.TODO(),
		topic,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:     "application/json",
			Body:            message,
			ContentEncoding: "utf-8",
		},
	)

	return err
}
