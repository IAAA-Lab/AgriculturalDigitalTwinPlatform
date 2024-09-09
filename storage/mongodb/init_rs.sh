#!/bin/bash
mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" <<EOF
rs.initiate(
  {
    _id: "rs0",
    members: [{ _id: 0, host: "mongo:27017" }],
  },
  { force: true }
);
rs.status();
EOF