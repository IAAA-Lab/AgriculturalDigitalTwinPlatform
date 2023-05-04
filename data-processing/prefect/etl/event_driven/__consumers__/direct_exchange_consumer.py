# Rabbitmq rpc consumer with pika

import asyncio
import json
from etl.event_driven.cultivos_identificadores.cultivos_identificadores_dt_etl import cultivos_identificadores_dt_etl
from etl.event_driven.recintos_almendros_cercanos.recintos_almendros_treatments_dt_etl import recintos_almendros_tratamientos_dt_etl
from etl.event_driven.recintos_almendros_cercanos.recintos_almendros_parcels_dt_etl import recintos_almendros_parcelas_dt_etl
from etl.event_driven.recintos_almendros_cercanos.recintos_almendros_parcels_trusted_etl import recintos_almendros_parcels_trusted_etl
from etl.event_driven.recintos_almendros_cercanos.recintos_almendros_treatments_trusted_etl import recintos_almendros_treatments_trusted_etl
from etl.utils.constants import Constants
import pika
import concurrent.futures


HOST = 'rabbitmq'
PORT = 5672
USER = 'guest'
PASSWORD = 'guest'
EXCHANGE_NAME = 'storage'
VIRTUAL_HOST = '/'
ROUTING_KEY = 'trusted'

WORKERS = 4

# Direct exchange consumer with pika


class RabbitmqDirectConsumer():
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.channel = None
        self.queue_name = None
        self.thread_pool = concurrent.futures.ThreadPoolExecutor(
            max_workers=WORKERS)

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
        self.thread_pool.submit(self.do_work, body)

    def do_work(self, body: str):
        try:
            data = json.loads(body)
            # TODO: make comprobations about veracity of data
            data_lake_zone = data['Records'][0]['s3']['bucket']['name']
            file_name = data['Records'][0]['s3']['object']['key'].replace(
                '%2F', '/')
            metadata_type = data['Records'][0]['s3']['object']['userMetadata']['X-Amz-Meta-Type']
            match data_lake_zone:
                case Constants.STORAGE_LANDING_ZONE.value:
                    match metadata_type:
                        case Constants.LANDING_ZONE_METADATA_PARCELS_AND_TREATMENTS.value:
                            recintos_almendros_parcels_trusted_etl(file_name)
                            recintos_almendros_treatments_trusted_etl(
                                file_name)
                        case _:
                            raise Exception(
                                f'Metadata type not found: {metadata_type}')
                case Constants.STORAGE_TRUSTED_ZONE.value:
                    match metadata_type:
                        case Constants.TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value:
                            recintos_almendros_tratamientos_dt_etl(file_name)
                        case Constants.TRUSTED_ZONE_METADATA_PARCELS_AND_TREATMENTS_PARCELS.value:
                            asyncio.run(
                                recintos_almendros_parcelas_dt_etl(file_name))
                            cultivos_identificadores_dt_etl()
                            
                        case _:
                            raise Exception(
                                f'Metadata type not found: {metadata_type}')
                case Constants.STORAGE_REFINED_ZONE.value:
                    # TODO: to implement
                    pass
                case _:
                    raise Exception(
                        f'Data lake zone not found: {data_lake_zone}')
        except Exception as e:
            print(e)

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
    print(" [x] Awaiting requests")
    consumer = RabbitmqDirectConsumer(config)
    try:
        consumer.run()
    except KeyboardInterrupt:
        consumer.close()
