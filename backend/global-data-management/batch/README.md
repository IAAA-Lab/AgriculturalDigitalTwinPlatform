# quarkus-getting-started Project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./gradlew quarkusDev
```

> **_NOTE:_** Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Packaging and running the application

The application can be packaged using:

```shell script
./gradlew build
```

It produces the `quarkus-run.jar` file in the `build/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `build/quarkus-app/lib/` directory.

The application is now runnable using `java -jar build/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./gradlew build -Dquarkus.package.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar build/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./gradlew build -Dquarkus.package.type=native
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./gradlew build -Dquarkus.package.type=native -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./build/quarkus-getting-started-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/gradle-tooling.

## Related Guides

- Camel Log ([guide](https://camel.apache.org/camel-quarkus/latest/reference/extensions/log.html)): Log messages to the underlying logging mechanism
- Camel SOAP dataformat ([guide](https://camel.apache.org/camel-quarkus/latest/reference/extensions/soap.html)): Marshal Java objects to SOAP messages and back
- Camel Jackson ([guide](https://camel.apache.org/camel-quarkus/latest/reference/extensions/jackson.html)): Marshal POJOs to JSON and back using Jackson
- Camel RabbitMQ ([guide](https://camel.apache.org/camel-quarkus/latest/reference/extensions/rabbitmq.html)): Send and receive messages from RabbitMQ instances
- Camel Rest ([guide](https://camel.apache.org/camel-quarkus/latest/reference/extensions/rest.html)): Expose REST services and their OpenAPI Specification or call external REST services

## Issues encountered

### Unmarshaling problems with strange utf-8 characters.

Image of the error

#### Explanation

#### Solution

The temporal solution that is being used for the moment is just converting the body from the HTTP request to **utf-8** encoding.

```
.convertBodyTo(String::class.java, "utf-8")
```

### Env variables and application properties

Env variables are recognized automatically by the file name `.env`. The environment variables have to be with `QUARKUS_` prefix in order for Quarkus to recognize them. I personally preffer to map the .env variables to the `application.properties` file. This way, Apache Camel can load the variables by simple writing `{{<properties variable>}}`.

### RabbitMQ

#### Explanation

#### Solution

The solution was simply changing the `camel-quarkus-rabbitmq` package to `camel-quarkus-spring-rabbitmq`. This new package is better suited and literally recommended by Camel.

This, way, as the default exchange and routing keys are used for routing, we can simply do this:

```
  val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.queue}}"
```

And the default exchange will route any routing key with the same name of the queues told make it really simple. When only have to get the rabbitmq request once, and not forward it again to the rpc queue. This is because the Camel exchange do it directly through its message properties:

```
MessageProperties [headers={}, correlationId=d088c20e-0b40-45ba-9c8f-8251867aa183, replyTo=amq.gen-2WAivGnv-UbRLplvFmwJAw, contentType=application/json, contentLength=0, redelivered=true, receivedExchange=, receivedRoutingKey=weather.daily, deliveryTag=1, consumerTag=amq.ctag-VMs1lEODM6SJUn5vua6vIA, consumerQueue=weather.daily])
```

Where the

## Utilities used

Json documents to kotlin data classes: https://jsonformatter.org/json-to-kotlin
