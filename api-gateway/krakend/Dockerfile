# Golang
FROM krakend/builder:2.3.2 as build-plugins
WORKDIR /app
COPY ./plugins /app
RUN go build -buildmode=plugin -o api-key-auth.so server/api-key-auth.go

FROM devopsfaith/krakend:watch as local
COPY ./local/config /etc/krakend
COPY --from=build-plugins /app/api-key-auth.so /etc/krakend/plugins/

FROM devopsfaith/krakend:2.3.1 as development
COPY ./dev/config /etc/krakend
COPY --from=build-plugins /app/api-key-auth.so /etc/krakend/plugins/



