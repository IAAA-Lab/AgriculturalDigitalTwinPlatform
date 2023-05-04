#!/bin/bash
# sleep 20
# Execute rpc consumer
python3 -m etl.event_driven.__consumers__.rpc_consumer &
# Execute direct exchange consumer
python3 -m etl.event_driven.__consumers__.direct_exchange_consumer &
# Execute prefect agent
prefect server start --host 0.0.0.0
