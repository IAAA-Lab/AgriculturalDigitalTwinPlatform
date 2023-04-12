#!/bin/bash

# Execute rabbitmq consumer
python3 -m messageQueue.rabbitmq.rabbitmq_listener &
# Execute prefect server
prefect server start --host 0.0.0.0
# Execute prefect agent
prefect agent start
