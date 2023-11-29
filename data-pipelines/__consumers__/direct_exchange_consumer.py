# Rabbitmq rpc consumer with pika

import asyncio
import json

from etl.__validation__.validate_raw_data_etl import validate_raw_data_etl
from etl.recintos_cercanos.recintos_almendros_parcels_trusted_etl import recintos_almendros_parcels_trusted_etl
from etl.recintos_cercanos.recintos_almendros_treatments_trusted_etl import recintos_almendros_treatments_trusted_etl
from etl.recintos_cercanos.recintos_almendros_treatments_dt_etl import recintos_almendros_treatments_dt_etl
from etl.recintos_cercanos.recintos_almendros_parcels_dt_etl import recintos_almendros_parcels_dt_etl
from etl.activities.activities_trusted_etl import activities_trusted_etl
from etl.activities.activities_dt_etl import activities_dt_etl
from utils.constants import Constants
import aio_pika
from aio_pika.abc import AbstractIncomingMessage
import os
import nest_asyncio

nest_asyncio.apply()

class RabbitmqConsumer:
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.channel = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust(config['AMQP_URL'])
        self.channel = await self.connection.channel()

    async def process_message(self, message):
        async with message.process():
            await action(message)

    async def consume(self):
        await self.channel.set_qos(prefetch_count=10)
        exchange = await self.channel.declare_exchange(
            config['EXCHANGE_NAME'], aio_pika.ExchangeType.DIRECT)
        queue = await self.channel.declare_queue(durable=True)
        await queue.bind(exchange, config['ROUTING_KEY'])

        await queue.consume(self.process_message)

    async def close(self):
        await self.connection.close()


async def action(message: AbstractIncomingMessage) -> None:
    await asyncio.sleep(2)
    data = json.loads(message.body)
    data_lake_zone = data['Records'][0]['s3']['bucket']['name']
    file_name = data['Records'][0]['s3']['object']['key'].replace(
        '%2F', '/')
    try:
        metadata_type = data['Records'][0]['s3']['object']['userMetadata']['X-Amz-Meta-Type']
    except KeyError:
        print('Metadata type not found')
        asyncio.run(validate_raw_data_etl(file_name))
        return
    try:
        match data_lake_zone:
            case Constants.STORAGE_LANDING_ZONE.value:
                match metadata_type:
                    case Constants.METADATA_PARCELS_AND_TREATMENTS.value:
                        asyncio.run(recintos_almendros_parcels_trusted_etl(
                            file_name))
                        asyncio.run(recintos_almendros_treatments_trusted_etl(file_name))
                    case Constants.METADATA_ACTIVITIES.value:
                        asyncio.run(activities_trusted_etl(file_name))
                    case _:
                        print(f'Metadata type not found: {metadata_type}')

            case Constants.STORAGE_TRUSTED_ZONE.value:
                match metadata_type:
                    case Constants.METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value:
                        asyncio.run(recintos_almendros_treatments_dt_etl(file_name))
                    case Constants.METADATA_PARCELS_AND_TREATMENTS_PARCELS.value:
                        asyncio.run(recintos_almendros_parcels_dt_etl(file_name))
                    case Constants.METADATA_ACTIVITIES.value:
                        asyncio.run(activities_dt_etl(file_name))
                    case _:
                        print(f'Metadata type not found: {metadata_type}')

            case Constants.STORAGE_REFINED_ZONE.value:
                # TODO: to implement
                pass

            case _:
                print(f'Not found data lake zone: {data_lake_zone}')
    except Exception as e:
        print(e)


async def main_direct_consumer(config):
    consumer = RabbitmqConsumer(config)
    await consumer.connect()
    await consumer.consume()
    print(" [x] Awaiting RPC requests")

    try:
        await asyncio.Future()
    finally:
        await consumer.close()


if __name__ == "__main__":
    config = {
        'AMQP_URL': os.environ.get('RABBITMQ_URI'),
        'EXCHANGE_NAME': "storage",
        'ROUTING_KEY': "trusted"
    }
    asyncio.run(main_direct_consumer(config))
