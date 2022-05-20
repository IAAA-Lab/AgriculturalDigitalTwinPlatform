FROM golang:alpine
# Add required packages
RUN apk add --update git curl bash
COPY . /gin-server
WORKDIR /gin-server
COPY go.mod go.sum ./
RUN go mod download
ENV CGO_ENABLED 0
#ENV GIN_MODE=release
EXPOSE 8080
