package temporal

import (
	"log"

	"go.temporal.io/sdk/client"
)

type temporalConn struct {
}

func NewTemporalConn(temporalUri string) *temporalConn {

	// if temporalUri == "" {
	// 	temporalUri = "temporal:7233"
	// }

	// temporalClient, err := client.Dial(client.Options{
	// 	HostPort:  temporalUri,
	// 	Namespace: "default",
	// })
	// if err != nil {
	// 	log.Fatalf("Failed to connect to Temporal server: %v", err)
	// }

	return &temporalConn{}
}

func (srv *temporalConn) GetClient(namespace string) client.Client {
	temporalClient, err := client.Dial(client.Options{
		HostPort:  "temporal:7233",
		Namespace: namespace,
	})
	if err != nil {
		log.Fatalf("Failed to connect to Temporal server: %v", err)
	}
	return temporalClient
}
