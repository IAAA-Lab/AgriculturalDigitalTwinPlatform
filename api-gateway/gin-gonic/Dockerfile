FROM golang:alpine

# Add required packages
# RUN apk add --update git curl bash
# COPY . /gin-server
# WORKDIR /gin-server
# COPY go.mod go.sum ./
# RUN go mod download
# ENV CGO_ENABLED 0
# ENV GIN_MODE=release
# EXPOSE 8080

#  https://harrk.dev/live-reloading-a-go-application-with-docker/

ENV PROJECT_DIR=/app \
  GO111MODULE=on \
  CGO_ENABLED=0

WORKDIR /app
RUN mkdir "/build"
COPY . .
RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon
ENTRYPOINT CompileDaemon -build="go build -C src/internal/cmd -o /build/app" -command="/build/app"