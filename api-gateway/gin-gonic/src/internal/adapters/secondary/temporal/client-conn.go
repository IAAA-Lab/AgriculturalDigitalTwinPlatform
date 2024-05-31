package temporal

import (
	"log"

	"go.temporal.io/sdk/client"
)

type temporalsrv struct {
	client client.Client
}

func NewTemporalConn(temporalUri string) *temporalsrv {

	if temporalUri == "" {
		temporalUri = "temporal:7233"
	}

	temporalClient, err := client.Dial(client.Options{
		HostPort:  temporalUri,
		Namespace: "default",
	})
	if err != nil {
		log.Fatalf("Failed to connect to Temporal server: %v", err)
	}

	return &temporalsrv{client: temporalClient}
}

func (srv *temporalsrv) GetClient() *client.Client {
	return &srv.client
}
