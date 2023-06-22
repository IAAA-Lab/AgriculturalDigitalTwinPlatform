#!/bin/bash
# Exit immediately if a command exits with a non zero status
set -e
# Treat unset variables as an error when substituting
set -u
function create_databases() {
    database=$1
    password=$2
    echo "Creating user and database '$database' with password '$password'"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
      CREATE USER $database with encrypted password '$password';
      CREATE DATABASE $database;
      GRANT ALL PRIVILEGES ON DATABASE $database TO $database;
EOSQL
}
# POSTGRES_MULTIBLE_DATABASES=db1,db2
# POSTGRES_MULTIBLE_DATABASES=db1:password,db2
if [ -n "$POSTGRES_MULTIPLE_DATABASES" ]; then
  echo "Multiple database creation requested: $POSTGRES_MULTIPLE_DATABASES"
  for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    user=$(echo $db | awk -F":" '{print $1}')
    pswd=$(echo $db | awk -F":" '{print $2}')
    if [[ -z "$pswd" ]]
    then
      pswd=$user
    fi
    echo "user is $user and pass is $pswd"
    create_databases $user $pswd
  done
  echo "Multiple databases created!"
fi