import asyncio
import os
from __consumers__.rpc_consumer import main_rpc_consumer
from __consumers__.direct_exchange_consumer import main_direct_consumer

from prometheus_client import start_http_server


if __name__ == '__main__':
    # Start subproceses
    print("Starting Prometheus exporter")
    start_http_server(9091)
    print("Prometheus exporter started")
    print("Starting RPC consumer")
    config = {
        'AMQP_URL': os.environ.get('RABBITMQ_URI'),
        'AMQP_QUEUE_NAME': "prefect"
    }
    loop = asyncio.new_event_loop()
    loop.run_until_complete(main_rpc_consumer(loop, config))
    loop.close()
    print("RPC consumer started")
    print("Starting Direct consumer")
    config = {
        'AMQP_URL': os.environ.get('RABBITMQ_URI'),
        'EXCHANGE_NAME': "storage",
        'ROUTING_KEY': "trusted"
    }
    asyncio.run(main_direct_consumer(config))
    print("Direct consumer started")
