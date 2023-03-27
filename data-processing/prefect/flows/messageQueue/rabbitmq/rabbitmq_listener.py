# Rabbitmq rpc consumer with pika

import json
import time
import pika
from servicesIngestion.daily_weather import daily_weather
from servicesIngestion.forecast_weather import forecast_weather

class RabbitmqRpcConsumer:
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
            credentials=pika.PlainCredentials(self.config['user'], self.config['password'])
        ))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.config['queue_name'])

    def on_request(self, ch, method, props, body):
        event_type = json.loads(body)['key']
        payload = None
        
        match event_type:
            case 'daily_weather':
                parcelId = json.loads(body)['payload']['parcelId']
                try:
                    payload = daily_weather(parcelId)
                except Exception as e:
                    print(str(e))
            case "forecast_weather":
                parcelId = json.loads(body)['payload']['parcelId']
                try:
                    payload = forecast_weather(parcelId)
                except Exception as e:
                    print(str(e))

        response = {
            'errorMessage': "",
            'payload': payload
        }

        ch.basic_publish(
            exchange='',
            routing_key=props.reply_to,
            properties=pika.BasicProperties(correlation_id=props.correlation_id),
            body=json.dumps(response)
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)


    def start_receiver(self):
        self.channel.basic_consume(queue=self.config['queue_name'], on_message_callback=self.on_request)
        self.channel.start_consuming()


if __name__ == '__main__':
    config = {
        'host': 'rabbitmq',
        'port': 5672,
        'virtual_host': '/',
        'queue_name': 'prefect',
        'user': 'guest',
        'password': 'guest'
    }
    rpc = RabbitmqRpcConsumer(config)
    rpc.connect()
    print(" [x] Awaiting RPC requests")
    rpc.start_receiver()
