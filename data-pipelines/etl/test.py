# from utils.constants import Constants
# import os
# import json
# import aio_pika
# import aiohttp
# import asyncio
# import time
# from prefect import flow

# start_time = time.time()


# async def get_pokemon(session, url):
#     # throw an exception
#     # raise Exception("An exception occurred")
#     async with session.get(url, timeout=0.0001) as resp:
#         pokemon = await resp.json()
#         return pokemon['name']


# # @flow
# async def main():

#     async with aiohttp.ClientSession() as session:

#         tasks = []
#         for number in range(1, 151):
#             url = f'https://pokeapi.co/api/v2/pokemon/{number}'
#             tasks.append(asyncio.ensure_future(get_pokemon(session, url)))

#         original_pokemon = await asyncio.gather(*tasks, return_exceptions=True)
#         for pokemon in original_pokemon:
#             if isinstance(pokemon, Exception):
#                 print(f"Error getting pokemon - {type(pokemon)}")
#                 continue


# asyncio.run(main())
# print("--- %s seconds ---" % (time.time() - start_time))

import os
import json
import aio_pika
import asyncio
import time


# ------------- Rabbitmq producer consumer -------------

start_time = time.time()


class RabbitmqProducer:
    def __init__(self, config):
        self.config = config
        self.connection = None
        self.channel = None

    async def connect(self):
        self.connection = await aio_pika.connect_robust(config['AMQP_URL'])
        self.channel = await self.connection.channel()

    async def publish(self, queue, message):
        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode()
            ),
            routing_key=queue
        )

    async def close(self):
        await self.connection.close()


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
            # Sleep for 5 seconds
            print(message.body)
            await asyncio.sleep(2)

    async def consume(self, queue):
        await self.channel.set_qos(prefetch_count=5)
        queue = await self.channel.declare_queue(queue)
        # Flush queue
        await queue.purge()
        await queue.consume(self.process_message)

    async def close(self):
        await self.connection.close()


def main(config):
    # Run consumer
    async def run_consumer():
        consumer = RabbitmqConsumer(config)
        await consumer.connect()
        await consumer.consume("test_queue")
        return consumer

    # Run producer
    async def run_producer():
        producer = RabbitmqProducer(config)
        await producer.connect()
        return producer

    # Run both
    async def run():
        consumer = await run_consumer()
        producer = await run_producer()
        # Publish 100 messages
        tasks = []
        for i in range(100):
            tasks.append(producer.publish("test_queue", {"id": i}))
        await asyncio.gather(*tasks)

        # # Close connection
        await producer.close()
        await asyncio.sleep(2 * 23)
        await consumer.close()

    # Run loop
    loop = asyncio.get_event_loop()
    loop.run_until_complete(run())


if __name__ == "__main__":
    # Config
    config = {
        "AMQP_URL": os.getenv('RABBITMQ_URI')
    }

    # Run
    main(config)
    print("--- %s seconds ---" % (time.time() - start_time))
