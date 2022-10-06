# prakticas-backend-gpsoft
Backend for the unoficial Unizar calendar and schedule service 

# Getting started

Tras clonar el repositorio funciona con el comando
```bash
 $ go run ./...
```

# Componentes 

## Core 
Resuelve la lógica de negocio independientemente de la infraestructura

## Acotres
Son todos los agentes externos
 - Drivers: son los que solicitan cosas al core (clientes)
 - Driven: El core se comunica con ellos (APIs, bases de datos)

 ## Ports 
 Son las onterfaces que nos permiten la comuncicación con lso actores, deberemos tener una interfaz por cada cotr, independientemente de si es **driven** or **driver**

 ## Adapters 

 Son las implenetaciones de dichas interfaces, transforman las peticiones o las llamas de forma que todos se entiendan

 ## Inyección de dependencias
 
 Hay que conectar los adaptadores a los puertos de alguna forma, esto nos permite conectar distintos adaptadores a un mismo puerto, de tal forma que se sencillo utiliza distintos actores


# Estructura
```
├── cmd 
├── pkg 
└── internal 
    ├── core 
    │   ├── domain 
    │   │   ├── game.go 
    │   │   └── board.go 
    │   ├── ports 
    │   │   ├── repositories.go 
    │   │   └── services.go 
    │   └── services 
    │       └── gamesrv 
    │           └── service.go 
    ├── handlers 
    └── data sources
```
## core
Todos los componentes iran ahí
### Domain
Aquí se encuentran los modelos (structs) que representarán las entidades de nuestro programa

### Ports
Aquí pondremos las interfaces para comunicarnos con los actores (`type <name> interface{}`)

### Servicios
Son las implementaciones de los puertos, es decir, el punto de entrada al **core**. Por ejemplo un caso de uso podría ser **"borrar libro"**.

## Handlers 

Todos los **driver adapters** van aquí, es decir los adaptadores de nuestros clientes. En este caso transformaremos peticiones http en llamadas a servicios.

## Data sources 

Todos los **driven adapters**  van aquí, es decir, los adaptadores de los recursos que usemos.

## CMD
Aquí van todos los main 


# Test

para crear los mocks se ha usado

```bash
$ mockgen -source=src/internal/core/ports/repositories.go -destination src/mocks/mockups/repositories.go
```