#!/bin/bash

python3 -m __consumers__.direct_exchange_consumer &
python3 -m __consumers__.rpc_consumer &

tail -f /dev/null
