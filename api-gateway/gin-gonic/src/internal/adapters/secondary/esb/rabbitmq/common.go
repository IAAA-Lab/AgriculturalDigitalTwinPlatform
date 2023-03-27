package rabbitmq

import (
	"context"
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/pkg/apperrors"

	"github.com/goccy/go-json"
	amqp "github.com/rabbitmq/amqp091-go"
)

func (r *RabbitMQConn) Close() {
	r.conn.Close()
}

func (r *RabbitMQConn) ClientRPC(routingKey string, correlationId string, event domain.SyncEventExtSend) (domain.SyncEventExtReceive, error) {
	ch, err := r.conn.Channel()
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	defer ch.Close()
	q, err := ch.QueueDeclare(
		"",    // name
		false, // durable
		false, // delete when unused
		true,  // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	corrId := correlationId
	body, err := json.Marshal(event)
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	err = ch.PublishWithContext(
		context.Background(),
		"",         // exchange
		routingKey, // routing key
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: corrId,
			ReplyTo:       q.Name,
			Body:          body,
		})
	if err != nil {
		return domain.SyncEventExtReceive{}, apperrors.ErrInternal
	}
	for d := range msgs {
		if corrId == d.CorrelationId {
			var response domain.SyncEventExtReceive
			err = json.Unmarshal(d.Body, &response)
			if err != nil {
				return domain.SyncEventExtReceive{}, apperrors.ErrInternal
			}
			return response, nil
		}
	}
	return domain.SyncEventExtReceive{}, apperrors.ErrInternal

}
