#!/bin/bash
sleep 30
# Execute rpc consumer
python3 -m servicesIngestion.consumer.rpc_consumer &
# Execute direct exchange consumer
# python3 -m etl.consumer.direct_exchange_consumer &
# Execute prefect server
prefect agent start &
# Execute prefect agent
prefect server start --host 0.0.0.0
