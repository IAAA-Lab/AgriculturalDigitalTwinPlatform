FROM mongo:latest
ADD init_db.sh /docker-entrypoint-initdb.d/
RUN chmod u+x /docker-entrypoint-initdb.d/init_db.sh