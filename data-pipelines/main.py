import asyncio
import os
from __consumers__.rpc_consumer import main_rpc_consumer
from __consumers__.direct_exchange_consumer import main_direct_consumer

from prometheus_client import start_http_server, Gauge


def export_crontab_metrics():
    # Define metrics
    crontab_job_time = Gauge(
        'crontab_job_time', 'Crontab job time', ['job_name'])
    print("Starting crontab exporter")
    # Get crontab string
    jobs = os.popen('crontab -l').read()
    print(jobs)
    # Obtain job name and time
    for job in jobs.split('\n'):
        if job != '' and job[0] != '#' and job[0] != '@':
            job_name = job.split(' ')[-1]
            job_time = job.split(' ')[0]
            # Export metrics
            crontab_job_time.labels(job_name).set(job_time)
    print("Crontab exporter started")


if __name__ == '__main__':
    # Start subproceses
    export_crontab_metrics()
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
