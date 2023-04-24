FROM golang:latest as local

#  https://harrk.dev/live-reloading-a-go-application-with-docker/
ENV PROJECT_DIR=/app \
  GO111MODULE=on \
  CGO_ENABLED=0

WORKDIR /app
RUN mkdir "/build"
COPY . .
RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon
RUN sleep 10
ENTRYPOINT CompileDaemon -build="go build -C src/cmd -o /build/app" -command="/build/app"

FROM golang:alpine as development

RUN apk add --update git curl bash
COPY . /app
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
ENV CGO_ENABLED 0 \
  GO111MODULE=on \
  GIN_MODE=release
RUN go build -o /app/main src/cmd/main.go
CMD ["go", "run", "src/cmd/main.go"]