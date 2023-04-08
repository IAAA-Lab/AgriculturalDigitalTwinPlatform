FROM golang:latest

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