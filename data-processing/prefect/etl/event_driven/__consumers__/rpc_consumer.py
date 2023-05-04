# Rabbitmq rpc consumer with pika

import json
import time
import pika
from etl.event_driven.weather.daily_weather import daily_weather
from etl.event_driven.weather.forecast_weather import forecast_weather
from etl.event_driven.weather.historical_weather import historical_weather

HOST = 'rabbitmq'
PORT = 5672
USER = 'guest'
PASSWORD = 'guest'
QUEUE_NAME = 'prefect'
VIRTUAL_HOST = '/'


class RabbitmqRpcConsumer():
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.channel = None
        self.queue_name = None
        self.callback_queue = None
        self.response = None
        self.corr_id = None

    def connect(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=self.config['host'],
            port=self.config['port'],
            virtual_host=self.config['virtual_host'],
            credentials=pika.PlainCredentials(
                self.config['user'], self.config['password'])
        ))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.config['queue_name'])

    def on_request(self, ch, method, props, body):
        event_type = json.loads(body)['key']
        payload = None
        response = None
        error_message = None

        print(" [.] %r" % body)
        match event_type:
            case 'daily_weather':
                try:
                    enclosureId = json.loads(body)['payload']['enclosureId']
                    payload = daily_weather(enclosureId)
                except Exception as e:
                    print(str(e))
                    error_message = "Error al obtener el clima diario"
            case "forecast_weather":
                try:
                    enclosureId = json.loads(body)['payload']['enclosureId']
                    payload = forecast_weather(enclosureId)
                except Exception as e:
                    print(str(e))
                    error_message = "Error al obtener el clima pronosticado"
            case "historical_weather":
                try:
                    payload = json.loads(body)['payload']
                    idema = payload['idema']
                    startDate = payload['startDate']
                    endDate = payload['endDate']
                    payload = historical_weather(idema, startDate, endDate)
                except Exception as e:
                    print(str(e))
                    error_message = "Error al obtener el clima historico"

            case _:
                error_message = "Unknown event type"

        response = {
            'errorMessage': error_message,
            'payload': payload
        }
        
        print(" [x] Response: %r" % response)

        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(
                correlation_id=props.correlation_id),
            body=json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)

    def consume(self):
        self.channel.basic_consume(
            queue=self.config['queue_name'], on_message_callback=self.on_request)
        self.channel.start_consuming()

    def close(self):
        self.channel.close()
        self.connection.close()

    def run(self):
        self.connect()
        self.consume()
        self.close()


if __name__ == '__main__':
    config = {
        'host': HOST,
        'port': PORT,
        'virtual_host': VIRTUAL_HOST,
        'queue_name': QUEUE_NAME,
        'user': USER,
        'password': PASSWORD
    }
    consumer = RabbitmqRpcConsumer(config)
    consumer.run()
