# quarkus-getting-started Project

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./gradlew quarkusDev
```

> **_NOTE:_** Quarkus now ships with a Dev UI, which is available in dev mode only at http://localhost:8080/q/dev/.

## Deploying to Docker

It will create a .jar and a runner file in the `build` directory. The project itself give us a docker folder under `src/main/docker`. In this folder, we have a `Dockerfile.native` and a `Dockerfile.jvm` file. The first one is for the native executable, and the second one is for the jvm executable.

To deploy for **local development** with docker ([guide](https://www.logicmonitor.com/blog/how-to-use-quarkus-live-coding-in-docker)), we can use the `Dockerfile.jvm` file. To do so, we have to build the project with:

```shell script
./gradlew build
```

Then, under `application.properties` file, we have to add the following lines:

```properties
quarkus.package.type=mutable-jar
quarkus.live-reload.password={{whatever password we want}}
quarkus.live-reload.url=http://localhost:{{port we want}}
```

With this, we are letting the app to do live reload when we change the code. Then, we can deploy the docker-compose.yml:

```shell script
docker compose up --build
```

Now, to do live reload, we have to do:

```shell script
./gradlew quarkusRemoteDev
```

And it will connect to the docker container and do live reload.

---

To deploy for **production**, we have to build the project with the `Dockerfile.native` file. To create the native executable:

```shell script
./gradlew build -x test -Dquarkus.package.type=native -Dquarkus.native.container-build=true -Dquarkus.native.container-runtime=docker
```

Now, we have to execute the docker-compose.yml file:

```shell script
docker compose up --build
```

The container is up and running.

## Issues encountered

### File component not working



#### Solution


### Unmarshaling problems with strange utf-8 characters

When trying to unmarshal a json object to a kotlin data class, as the json object was in Spanish, it does not unmarshal correctly some characters (I assume). The problem was that the characters were not being recognized as utf-8, so the unmarshalling was not working correctly.

#### Solution

The temporal solution that is being used for the moment is just converting the body from the HTTP request to **utf-8** encoding.

```kotlin
.convertBodyTo(String::class.java, "utf-8")
```

### Env variables and application properties

Env variables are recognized automatically by the file name `.env`. The environment variables have to be with `QUARKUS_` prefix in order for Quarkus to recognize them. I personally preffer to map the .env variables to the `application.properties` file. This way, Apache Camel can load the variables by simple writing `{{<properties variable>}}`.

### RabbitMQ

The RabbitMQ package used was `camel-quarkus-rabbitmq`. This package is not recommended by Camel, and it is not well documented. It gave a lot of trouble when trying to route messages to the correct queues.

#### Solution

The solution was simply changing the `camel-quarkus-rabbitmq` package to `camel-quarkus-spring-rabbitmq`. This new package is better suited and literally recommended by Camel.

This, way, as the default exchange and routing keys are used for routing, we can simply do this:

```kotlin
  val RABBIMQ_ROUTE = "spring-rabbitmq:default?queues={{rabbitmq.weather.daily.queue}}"
```

And the default exchange will route any routing key with the same name of the queues told make it really simple. When only have to get the rabbitmq request once, and not forward it again to the rpc queue. This is because the Camel exchange do it directly through its message properties:

```shell script
MessageProperties [headers={}, correlationId=d088c20e-0b40-45ba-9c8f-8251867aa183, replyTo=amq.gen-2WAivGnv-UbRLplvFmwJAw, contentType=application/json, contentLength=0, redelivered=true, receivedExchange=, receivedRoutingKey=weather.daily, deliveryTag=1, consumerTag=amq.ctag-VMs1lEODM6SJUn5vua6vIA, consumerQueue=weather.daily])
```

Where the

## Utilities used

Json documents to kotlin data classes: https://jsonformatter.org/json-to-kotlin
