FROM golang:alpine

RUN apk add --update git curl bash
COPY . /app
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
ENV CGO_ENABLED 0 \
  GO111MODULE=on \
  GIN_MODE=release
RUN go build -o /app/main src/internal/cmd/main.go
CMD ["/app/main"]
