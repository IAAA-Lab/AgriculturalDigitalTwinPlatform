#!/bin/bash

# Execute prefect server
prefect server start --host 0.0.0.0
sleep 10
# Execute prefect agent
prefect agent start
# Execute rabbitmq listener
python3 -m messageQueue.rabbitmq.rabbitmq_listener
