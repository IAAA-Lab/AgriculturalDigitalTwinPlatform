package rabbitmq

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"
	"time"

	"github.com/goccy/go-json"
	amqp "github.com/rabbitmq/amqp091-go"
)

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
		true,
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

func (r *RabbitMQConn) Subscribe(queueName string, exchange string, routingKey string, out chan amqp.Delivery) {
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueueBindedToExchangeWithRoutingKey(queueName, exchange, routingKey)
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

func (r *RabbitMQConn) Publish(exchange string, routingKey string, correlationId string, message []byte) error {
	ch := r.GetChannel()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	defer ch.Close()
	err := ch.PublishWithContext(
		ctx,
		exchange,
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:     "application/json",
			Body:            message,
			ContentEncoding: "utf-8",
			CorrelationId:   correlationId,
		},
	)

	return err
}

func (r *RabbitMQConn) PublishAndWait(routingKey string, correlationId string, event domain.SyncEventExtSend) (domain.SyncEventExtReceive, error) {
	message, err := json.Marshal(event)
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	ch := r.GetChannel()
	defer ch.Close()
	q := r.GetQueue("")
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
		return domain.SyncEventExtReceive{}, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = ch.PublishWithContext(
		ctx,
		"",
		routingKey,
		false,
		false,
		amqp.Publishing{
			ContentType:   "application/json",
			Body:          message,
			CorrelationId: correlationId,
			ReplyTo:       q.Name,
		},
	)
	if err != nil {
		return domain.SyncEventExtReceive{}, err
	}

	for d := range h {
		if d.CorrelationId == correlationId {
			var event domain.SyncEventExtReceive
			err = json.Unmarshal(d.Body, &event)
			return event, err
		}
	}
	return domain.SyncEventExtReceive{}, apperrors.ErrInternal
}
