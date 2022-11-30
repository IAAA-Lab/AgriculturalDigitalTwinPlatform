#!/bin/bash
set -e

mongo ${MONGO_INITDB_DATABASE} <<EOF

db.auth("${MONGO_INITDB_ROOT_USERNAME}", "${MONGO_INITDB_ROOT_PASSWORD}")
db.createCollection("User")
db.User.insert({"username": "${MONGODB_USER}", "passwd": "${MONGODB_PASSWORD}", "role": "admin"})
db.createCollection("News")
db.createCollection("Analysis")
db.createCollection("Fields")
EOF