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

use ${MONGODB_DATABASE}
db.createCollection("User")
db.auth("${MONGODB_ROOT_USER}", "${MONGODB_ROOT_PASS}")
db.User.insert({"username": "${MONGODB_USER}", "passwd": "${MONGODB_PASSWORD}", "role": "admin"})
db.createCollection("News")
EOF