package parcelssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	fieldsPersistenceRepository ports.ParcelsRepository
}

func New(parcelsRepository ports.ParcelsRepository) *service {
	return &service{
		fieldsPersistenceRepository: parcelsRepository,
	}
}

func (srv *service) GetParcels(userId primitive.ObjectID, anyo int) ([]domain.Parcel, error) {
	parcelRefs, err := srv.fieldsPersistenceRepository.GetParcelsRef(userId)
	if err != nil {
		return []domain.Parcel{}, err
	}
	return srv.fieldsPersistenceRepository.GetParcels(parcelRefs, anyo)
}

func (srv *service) PostParcelsAndEnclosures(userId primitive.ObjectID, parcels []domain.ParcelRefs) error {
	return srv.fieldsPersistenceRepository.PostParcelsAndEnclosures(userId, parcels)
}

func (srv *service) GetParcelRefs(userId primitive.ObjectID, anyo int) ([]domain.ParcelRefs, error) {
	return srv.fieldsPersistenceRepository.GetParcelsRef(userId)
}
