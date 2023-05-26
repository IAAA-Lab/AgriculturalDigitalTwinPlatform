# Rabbitmq rpc consumer with pika

import asyncio
import json
import os

from etl.weather.forecast_weather import forecast_weather
from etl.weather.daily_weather import daily_weather
import aio_pika
from aio_pika.abc import AbstractIncomingMessage


async def main_rpc_consumer(loop, config):
    connection = await aio_pika.connect_robust(
        config["AMQP_URL"], loop=loop
    )

    async with connection:
        channel = await connection.channel()
        exchange = channel.default_exchange
        queue = await channel.declare_queue(
            config["AMQP_QUEUE_NAME"])

        async with queue.iterator() as queue_iter:
            message: AbstractIncomingMessage
            async for message in queue_iter:
                async with message.process(requeue=False):
                    try:
                        assert message.reply_to is not None

                        event_type = json.loads(message.body)['key']
                        body = message.body
                        payload = None
                        response = None
                        error_message = None

                        print(" [.] %r" % message.body)

                        match event_type:
                            case 'daily_weather':
                                try:
                                    enclosureId = json.loads(
                                        body)['payload']['enclosureId']
                                    payload = daily_weather(enclosureId)
                                except Exception as e:
                                    print(str(e))
                                    error_message = "Error al obtener el clima diario"
                            case "forecast_weather":
                                try:
                                    enclosureId = json.loads(
                                        body)['payload']['enclosureId']
                                    payload = forecast_weather(enclosureId)
                                except Exception as e:
                                    print(str(e))
                                    error_message = "Error al obtener el clima pronosticado"
                            # case "historical_weather":
                            #     try:
                            #         payload = json.loads(body)['payload']
                            #         idema = payload['idema']
                            #         startDate = payload['startDate']
                            #         endDate = payload['endDate']
                            #         payload = historical_weather(
                            #             idema, startDate, endDate)
                            #     except Exception as e:
                            #         print(str(e))
                            #         error_message = "Error al obtener el clima historico"

                            case _:
                                error_message = "Unknown event type"

                        response = {
                            'errorMessage': error_message,
                            'payload': payload
                        }

                        print(" [x] Response: %r" % response)

                        await exchange.publish(
                            aio_pika.Message(
                                body=json.dumps(response).encode(),
                                correlation_id=message.correlation_id
                            ),
                            routing_key=message.reply_to
                        )

                    except Exception as e:
                        print(str(e))


if __name__ == '__main__':
    config = {
        'AMQP_URL': os.environ.get('RABBITMQ_URI'),
        'AMQP_QUEUE_NAME': "prefect"
    }
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main_rpc_consumer(loop, config))
    loop.close()
