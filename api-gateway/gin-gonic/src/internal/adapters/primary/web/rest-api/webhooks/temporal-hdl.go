package weebhooks

import (
	"digital-twin/main-server/src/internal/core/ports"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type HTTPWebhookHandler struct {
	digitalTwinsService ports.DigitalTwinsService
}

func NewHTTPWebhookHandler(digitalTwinsService ports.DigitalTwinsService) *HTTPWebhookHandler {
	return &HTTPWebhookHandler{
		digitalTwinsService: digitalTwinsService,
	}
}

// Information that interests us
type WebhookData struct {
	EventName string `json:"EventName"`
	Key       string `json:"Key"`
	Records   []struct {
		S3 struct {
			Object struct {
				Key          string `json:"key"`
				UserMetadata struct {
					DigitalTwinID string `json:"X-Amz-Meta-Digital-Twin-Id"`
					Type          string `json:"X-Amz-Meta-Type"`
					ContentType   string `json:"content-type"`
				} `json:"userMetadata"`
			} `json:"object"`
		} `json:"s3"`
	} `json:"Records"`
}

func (h *HTTPWebhookHandler) HandleWebhookLanding(c *gin.Context) {
	var data WebhookData
	err := json.NewDecoder(c.Request.Body).Decode(&data)
	if err != nil {
		fmt.Println(err)
	}
	// Get user metadata
	digitalTwinId := data.Records[0].S3.Object.UserMetadata.DigitalTwinID
	typeOfData := data.Records[0].S3.Object.UserMetadata.Type
	FileName := strings.Split(data.Records[0].S3.Object.Key, "1%2F")[1]
	// Send response
	c.JSON(200, gin.H{
		"message": "Webhook received successfully",
	})
	// Execute enrichment data workflows
	if typeOfData == "activity" {
		err = h.digitalTwinsService.SetNewActivities(digitalTwinId, FileName, os.Getenv("MINIO_LANDING_ZONE"))
		if err != nil {
			fmt.Println(err)
		}
	}
	if typeOfData == "yield" {
		err = h.digitalTwinsService.SetNewYield(digitalTwinId, FileName, os.Getenv("MINIO_LANDING_ZONE"))
		if err != nil {
			fmt.Println(err)
		}
	}
}

func (h *HTTPWebhookHandler) HandleWebhookTrusted(c *gin.Context) {
	var data WebhookData
	err := json.NewDecoder(c.Request.Body).Decode(&data)
	if err != nil {
		fmt.Println(err)
	}
	// Get user metadata
	digitalTwinId := data.Records[0].S3.Object.UserMetadata.DigitalTwinID
	typeOfData := data.Records[0].S3.Object.UserMetadata.Type
	FileName := strings.Split(data.Records[0].S3.Object.Key, "1%2F")[1]

	// Send response
	c.JSON(200, gin.H{
		"message": "Webhook received successfully",
	})
	// Execute enrichment data workflow
	if typeOfData == "activity" {
		err = h.digitalTwinsService.SetNewActivities(digitalTwinId, FileName, os.Getenv("MINIO_TRUSTED_ZONE"))
		if err != nil {
			fmt.Println(err)
		}
	}
	if typeOfData == "yield" {
		err = h.digitalTwinsService.SetNewYield(digitalTwinId, FileName, os.Getenv("MINIO_TRUSTED_ZONE"))
		if err != nil {
			fmt.Println(err)
		}
	}
}
