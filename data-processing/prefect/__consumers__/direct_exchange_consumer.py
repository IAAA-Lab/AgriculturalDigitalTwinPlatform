# Rabbitmq rpc consumer with pika

import asyncio
import json
from utils.constants import Constants
from __notifications__.email_notifications import notify_exc_by_email
import aio_pika
from aio_pika.abc import AbstractIncomingMessage
import os
from prefect.deployments import run_deployment


async def process_message(message: AbstractIncomingMessage) -> None:
    async with message.process():
        data = json.loads(message.body)
        data_lake_zone = data['Records'][0]['s3']['bucket']['name']
        file_name = data['Records'][0]['s3']['object']['key'].replace(
            '%2F', '/')
        try:
            metadata_type = data['Records'][0]['s3']['object']['userMetadata']['X-Amz-Meta-Type']
        except KeyError:
            asyncio.create_task(run_deployment(
                name="validate_raw_data_etl/event-driven", parameters={"file_name": file_name}))
            return
        match data_lake_zone:
            case Constants.STORAGE_LANDING_ZONE.value:
                match metadata_type:
                    case Constants.METADATA_PARCELS_AND_TREATMENTS.value:
                        asyncio.create_task(run_deployment(
                            name="recintos_almendros_parcels_trusted_etl/event-driven", parameters={"file_name": file_name}))
                        asyncio.create_task(run_deployment(
                            name="recintos_almendros_treatments_trusted_etl/event-driven", parameters={"file_name": file_name}))
                    case Constants.METADATA_ACTIVITIES.value:
                        asyncio.create_task(run_deployment(
                            name="activities_trusted_etl/event-driven", parameters={"file_name": file_name}))
                    case _:
                        print(f'Metadata type not found: {metadata_type}')

            case Constants.STORAGE_TRUSTED_ZONE.value:
                match metadata_type:
                    case Constants.METADATA_PARCELS_AND_TREATMENTS_TREATMENTS.value:
                        asyncio.create_task(run_deployment(name="recintos_almendros_treatments_dt_etl/event-driven",
                                                           parameters={"file_name": file_name}))
                    case Constants.METADATA_PARCELS_AND_TREATMENTS_PARCELS.value:
                        asyncio.create_task(run_deployment(name="recintos_almendros_parcels_dt_etl/event-driven",
                                                           parameters={"file_name": file_name}))
                    case Constants.METADATA_ACTIVITIES.value:
                        asyncio.create_task(run_deployment(
                            name="activities_dt_etl/event-driven", parameters={"file_name": file_name}))
                    case _:
                        print(f'Metadata type not found: {metadata_type}')

            case Constants.STORAGE_REFINED_ZONE.value:
                # TODO: to implement
                pass

            case _:
                print(f'Not found data lake zone: {data_lake_zone}')


async def main_direct_consumer(config):
    connection = await aio_pika.connect_robust(config['AMQP_URL'])
    channel = await connection.channel()
    await channel.set_qos(prefetch_count=2)

    exchange = await channel.declare_exchange(
        config['EXCHANGE_NAME'], aio_pika.ExchangeType.DIRECT)

    queue = await channel.declare_queue(durable=True)
    await queue.bind(exchange, config['ROUTING_KEY'])

    await queue.consume(process_message)

    try:
        await asyncio.Future()
    finally:
        await connection.close()

if __name__ == "__main__":
    config = {
        'AMQP_URL': os.environ.get('RABBITMQ_URI'),
        'EXCHANGE_NAME': "storage",
        'ROUTING_KEY': "trusted"
    }
    asyncio.run(main_direct_consumer(config))
