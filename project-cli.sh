#!/bin/bash

# Shell for executing project cli commnads

## Set the path to the cli
PATH_CLI=src/internal/adapters/primary/cli
## Find the container name which contains the "gin-gonic" string
DOCKER_LIST=$(docker ps -a --format "{{.Names}}")
CONTAINER_NAME=$(echo "${DOCKER_LIST}" | grep "gin-gonic")
ARGS="$@"
## Execute the cli command with indefinite number of arguments within docker container
docker exec -it ${CONTAINER_NAME} bash -c "go run ${PATH_CLI}/cli.go ${ARGS}"