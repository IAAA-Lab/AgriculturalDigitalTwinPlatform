#!/bin/bash
set -e

mongo <<EOF
# use admin
# db.createUser(
#   {
#     user: "${MONGO_USER}",
#     pwd: "${MONGO_PASS}",
#     roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
#   }
# )

db.auth("${MONGO_INITDB_ROOT_USERNAME}", "${MONGO_INITDB_ROOT_PASSWORD}")
db = db.getSiblingDB(${MONGO_INITDB_DATABASE})
db.createCollection("User")
db.User.insert({"username": "${MONGODB_USER}", "passwd": "${MONGODB_PASSWORD}", "role": "admin"})
db.createCollection("News")
EOF