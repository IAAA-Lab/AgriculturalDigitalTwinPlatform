#!/bin/bash
set -e

until mongosh --eval "print(\"waited for connection\")"
do
    sleep 2
done

mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --port "$MONGO_PORT" <<EOF
rs.initiate(
  {
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:${MONGO_PORT}" }],
  },
  { force: true }
);
rs.status();
EOF