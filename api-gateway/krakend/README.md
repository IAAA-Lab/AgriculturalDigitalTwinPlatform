# Krakend Api Gateway with billing capabilities

This is the Api Gateway that serve private and public endpoints from some of the IAAA systems. It is powered by [Krakend](https://www.krakend.io/), a Go framework for building API Gateways, RabbitMQ for event-driven communication, [BuntDB](https://github.com/tidwall/buntdb), and embedded database for storing the customer's billing information and [Stripe](https://stripe.com/) for payment gateway.

## Getting Started

### Prerequisites

Everything is containerized, so you only need the following:

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installing and Running

1. Clone the repository
2. Create a `.env` file in the root directory of the project and add the environment variables present in the `.env.example` file
3. Run `docker-compose up --build` to build the images and run the containers
5. 

<https://support.google.com/accounts/answer/185833>
