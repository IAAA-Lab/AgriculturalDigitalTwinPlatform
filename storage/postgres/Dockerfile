FROM postgres:15.2-alpine

COPY init_multiple_databases.sh /docker-entrypoint-initdb.d/init_multiple_databases.sh
RUN chmod +x /docker-entrypoint-initdb.d/init_multiple_databases.sh