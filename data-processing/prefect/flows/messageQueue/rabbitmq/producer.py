# Rabbitmq rpc producer with pika

import json
import pika
import uuid

class RabbitmqRpcProducer:
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
        result = self.channel.queue_declare(queue="", exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(
            queue=self.callback_queue,
            on_message_callback=self.on_response,
            auto_ack=True
        )

        self.response = None
        self.corr_id = None

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            self.response = body

    def call(self, message):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        self.channel.basic_publish(
            exchange='',
            routing_key=self.config['queue_name'],
            properties=pika.BasicProperties(
                reply_to=self.callback_queue,
                correlation_id=self.corr_id,
            ),
            body=str(message)
        )
        self.connection.process_data_events(time_limit=None)
        return str(self.response)

    def close(self):
        self.connection.close()

if __name__ == '__main__':
    config = {
        'host': 'rabbitmq',
        'port': 5672,
        'virtual_host': '/',
        'queue_name': 'prefect',
        'user': 'guest',
        'password': 'guest'
    }
    rpc = RabbitmqRpcProducer(config)
    rpc.connect()
    print(" [x] Requesting weather")
    i = 0
    while i < 10000:
        response = rpc.call('weather')
        # print(" [.] Got %r" % response)
        i += 1
    rpc.close()