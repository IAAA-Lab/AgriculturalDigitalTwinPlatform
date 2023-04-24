# Rabbitmq rpc consumer with pika

import json
import time
import pika
from etl.dtStorage.recintos_almendros_parcels_dt_etl import recintos_almendros_parcelas_dt_etl
from etl.dtStorage.recintos_almendros_treatments_dt_etl import recintos_almendros_tratamientos_dt_etl
from etl.trusted.recintos_almendros_trusted_etl import recintos_almendros_trusted_etl
from servicesIngestion.daily_weather import daily_weather
from servicesIngestion.forecast_weather import forecast_weather
from servicesIngestion.historical_weather import historical_weather

HOST = 'rabbitmq'
PORT = 5672
USER = 'guest'
PASSWORD = 'guest'
EXCHANGE_NAME = 'storage'
VIRTUAL_HOST = '/'
ROUTING_KEY = 'trusted'

# Direct exchange consumer with pika


class RabbitmqDirectConsumer():
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.channel = None
        self.queue_name = None

    def connect(self):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(
            host=self.config['host'],
            port=self.config['port'],
            virtual_host=self.config['virtual_host'],
            credentials=pika.PlainCredentials(
                self.config['user'], self.config['password'])
        ))
        self.channel = self.connection.channel()
        self.channel.exchange_declare(
            exchange=self.config['exchange_name'], exchange_type='direct')
        result = self.channel.queue_declare('', exclusive=True)
        self.queue_name = result.method.queue
        self.channel.queue_bind(
            exchange=self.config['exchange_name'], queue=self.queue_name, routing_key=self.config['routing_key'])

    def on_message(self, ch, method, properties, body):
        data = json.loads(body)
        # TODO: make comprobations about veracity of data
        data_lake_zone = data['Records'][0]['s3']['bucket']['name']
        file_name = data['Records'][0]['s3']['object']['key']
        metadata_type = data['Records'][0]['s3']['object']['userMetadata']['x-amz-meta-type']
        match data_lake_zone:
            case 'landing-zone':
                # TODO: implement a file validator that checks if the file is valid and act accordingly
                pass
            case 'raw-zone':
                match metadata_type:
                    case 'parcels_and_treatments':
                        recintos_almendros_trusted_etl(file_name)
                    case _:
                        raise Exception(
                            f'Metadata type not found: {metadata_type}')
            case 'trusted-zone':
                match metadata_type:
                    case 'parcels_and_treatments_treatments':
                        recintos_almendros_parcelas_dt_etl(file_name)
                    case 'parcels_and_treatments_parcels':
                        recintos_almendros_tratamientos_dt_etl(file_name)
                    case _:
                        raise Exception(
                            f'Metadata type not found: {metadata_type}')
            case 'refined-zone':
                # TODO: to implement
                pass
            case _:
                raise Exception(f'Data lake zone not found: {data_lake_zone}')

    def consume(self):
        self.channel.basic_consume(
            queue=self.queue_name, on_message_callback=self.on_message, auto_ack=True)
        self.channel.start_consuming()

    def close(self):
        self.channel.close()
        self.connection.close()

    def run(self):
        self.connect()
        self.consume()
        self.close()


if __name__ == "__main__":
    config = {
        'host': HOST,
        'port': PORT,
        'user': USER,
        'password': PASSWORD,
        'exchange_name': EXCHANGE_NAME,
        'virtual_host': VIRTUAL_HOST,
        'routing_key': ROUTING_KEY
    }
    print(" [x] Awaiting RPC requests")
    consumer = RabbitmqDirectConsumer(config)
    consumer.run()
