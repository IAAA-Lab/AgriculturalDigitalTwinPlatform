#!/bin/bash

# Execute rpc consumer for on-demand etl
python3 -m __consumers__.rpc_consumer &
# Execute direct exchange consumer for event-based etl
python3 -m __consumers__.direct_exchange_consumer &
# Don't exit
tail -f /dev/null
