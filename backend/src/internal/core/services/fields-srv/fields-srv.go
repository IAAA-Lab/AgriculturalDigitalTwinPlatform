package fieldssrv

import (
	"fmt"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"strconv"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	fieldsAPIrepository         ports.FieldsAPIRepository
	fieldsPersistenceRepository ports.FieldsPersistenceRepository
	fieldsWeatherRepository     ports.FieldsWeatherRepository
}

func New(fieldsAPIRepository ports.FieldsAPIRepository, fieldsPersistenceRepository ports.FieldsPersistenceRepository, fielsWeatherRepository ports.FieldsWeatherRepository) *service {
	return &service{fieldsAPIrepository: fieldsAPIRepository, fieldsPersistenceRepository: fieldsPersistenceRepository, fieldsWeatherRepository: fielsWeatherRepository}
}

func (srv *service) GetParcels(userId primitive.ObjectID, anyo int) ([]domain.Parcel, error) {
	parcelRefs, err := srv.fieldsPersistenceRepository.GetParcelsRef(userId)
	if err != nil {
		return []domain.Parcel{}, err
	}
	parcels, err := srv.fieldsPersistenceRepository.GetParcels(parcelRefs, anyo)
	if err != nil {
		// Get information from the external api and store it
		parcels := []domain.Parcel{}
		var allParcelIds []string
		for _, x := range parcelRefs {
			allParcelIds = append(allParcelIds, x.Id)
		}
		handleParcels(srv, allParcelIds, anyo, &parcels)
		handleEnclosures(srv, allParcelIds, anyo, &parcels)
	}
	return parcels, nil
}

func (srv *service) PostParcelsAndEnclosures(userId primitive.ObjectID, parcels []domain.ParcelRefs) error {
	return srv.fieldsPersistenceRepository.PostParcelsAndEnclosures(userId, parcels)
}

// ----------------------------------------------------- \\
// ----------------- Private functions ----------------- \\
// ----------------------------------------------------- \\

func getAvgNDVI(srv *service, anyo int, parcelId string) domain.NDVI {
	ndvi, err := srv.fieldsAPIrepository.GetAvgNDVI(domain.TeleAvgParams{
		Operation: "getndviindexmeanvaluezone",
		InitDate:  fmt.Sprintf("01-01-%d", anyo),
		EndDate:   fmt.Sprintf("31-01-%d", anyo),
		Id:        parcelId,
	})
	if err != nil || len(ndvi.Response) == 0 {
		return domain.NDVI{
			Avg: -1,
		}
	}
	var avgNDVI float32 = 0.0
	fmt.Println(ndvi.Response)

	return domain.NDVI{
		Avg: avgNDVI,
	}
}

func handleParcels(srv *service, allParcelIds []string, anyo int, parcels *[]domain.Parcel) error {
	remoteParcelsInfo, err := srv.fieldsAPIrepository.GetParcels(domain.ParcelParams{
		Id:        allParcelIds,
		Anno:      strconv.Itoa(anyo),
		Operation: "parcelascentroides",
		Epsgcode:  4258,
	})
	if err != nil {
		return err
	}
	parseParcels(remoteParcelsInfo, parcels)
	return err
}

func handleEnclosures(srv *service, allParcelIds []string, anyo int, parcels *[]domain.Parcel) error {
	remoteEnclosures, err := srv.fieldsAPIrepository.GetEnclosures(domain.EnclosureParams{
		Ids:       allParcelIds,
		Anno:      strconv.Itoa(anyo),
		Epsgcode:  4258,
		Operation: "recintos",
	})
	if err != nil {
		return err
	}

	for _, parcel := range *parcels {
		parseEnclosures(srv, anyo, remoteEnclosures, &parcel)
		err = srv.fieldsPersistenceRepository.PostParcel(parcel)
	}
	return err
}
