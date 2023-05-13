# Golang
FROM krakend/builder:2.3.2 as build-plugins
WORKDIR /app
COPY ./plugins /app
# Validate plugins go.sum
ENV GO111MODULE=on
RUN go mod download
RUN go mod verify
RUN go mod tidy
# Build plugins
RUN go build -buildmode=plugin -o payment-checkout.so server/payment-checkout/payment-checkout.go
RUN go build -buildmode=plugin -o api-key-auth.so server/api-key-auth/api-key-auth.go
RUN go build -buildmode=plugin -o payment-webhook.so server/payment-webhook/payment-webhook.go

FROM devopsfaith/krakend:watch as local
COPY --from=build-plugins /app /etc/krakend/plugins
# RUN krakend check-plugin --sum /etc/krakend/plugins/go.sum -f

FROM devopsfaith/krakend:2.3.2 as development
COPY --from=build-plugins /app /etc/krakend/plugins/



