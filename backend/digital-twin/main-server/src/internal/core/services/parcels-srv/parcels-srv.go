package parcelssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	parcelsRepository ports.ParcelsRepository
}

func New(parcelsRepository ports.ParcelsRepository) *service {
	return &service{
		parcelsRepository: parcelsRepository,
	}
}

func (srv *service) GetUserParcels(userId string) (domain.UserParcels, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.UserParcels{}, apperrors.ErrInvalidInput
	}
	return srv.parcelsRepository.GetUserParcels(userIdObj)
}

func (srv *service) PostUserParcels(userId string, enclosureIds []string) error {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return apperrors.ErrInvalidInput
	}
	return srv.parcelsRepository.PatchUserEnclosures(userIdObj, enclosureIds)
}

func (srv *service) GetEnclosures(enclosureIds []string) ([]domain.Parcel, error) {
	return srv.parcelsRepository.GetParcels(enclosureIds)
}

func (srv *service) PostParcel(parcel domain.Parcel) error {
	return srv.parcelsRepository.PostParcel(parcel)
}

func (srv *service) GetSummary(userId string) (domain.Summary, error) {
	userIdObj, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		return domain.Summary{}, apperrors.ErrInvalidInput
	}
	userParcels, err := srv.parcelsRepository.GetUserParcels(userIdObj)
	if err != nil {
		return domain.Summary{}, err
	}
	return userParcels.Summary, err
}
