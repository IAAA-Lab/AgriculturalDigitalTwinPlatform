package agroslabrepo

import (
	"net/http"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/pkg/apperrors"

	"github.com/parnurzeal/gorequest"
)

type fieldsAgroslabSrv struct {
	uri       string
	authToken string
	client    *gorequest.SuperAgent
}

func NewHttpConn(uri string, authToken string) *fieldsAgroslabSrv {
	return &fieldsAgroslabSrv{uri: uri, client: gorequest.New(), authToken: authToken}
}

func (srv *fieldsAgroslabSrv) GetGeneralInfoByUser(params domain.UserParcelParams) (domain.UserParcelResponse, error) {
	var generalInfo domain.UserParcelResponse
	res, _, err := srv.client.Get(srv.uri).Query(params).AppendHeader("authorization", srv.authToken).EndStruct(&generalInfo)
	if err != nil {
		return domain.UserParcelResponse{}, err[0]
	}
	if res.StatusCode != http.StatusOK {
		return domain.UserParcelResponse{}, apperrors.ErrInternal
	}
	return generalInfo, nil
}

func (srv *fieldsAgroslabSrv) GetParcels(params domain.ParcelParams) (domain.ParcelResponse, error) {
	var parcelInfo domain.ParcelResponse
	res, _, err := srv.client.Post(srv.uri).Send(params).AppendHeader("authorization", srv.authToken).EndStruct(&parcelInfo)
	if err != nil {
		return domain.ParcelResponse{}, err[0]
	}
	if res.StatusCode != http.StatusOK {
		return domain.ParcelResponse{}, apperrors.ErrInternal
	}
	return parcelInfo, nil
}

func (srv *fieldsAgroslabSrv) GetEnclosures(params domain.EnclosureParams) (domain.EnclosureResponse, error) {
	var enclosureInfo domain.EnclosureResponse
	res, _, err := srv.client.Post(srv.uri).Send(params).AppendHeader("authorization", srv.authToken).EndStruct(&enclosureInfo)
	if err != nil {
		return domain.EnclosureResponse{}, err[0]
	}
	if res.StatusCode != http.StatusOK {
		return domain.EnclosureResponse{}, apperrors.ErrInternal
	}
	return enclosureInfo, nil
}

// ---- TELEDETECTION ----

func (srv *fieldsAgroslabSrv) GetAvgNDVI(params domain.TeleAvgParams) (domain.TeleAvgResponse, error) {
	var avgNDVI domain.TeleAvgResponse
	res, _, err := srv.client.Post("https://teledeteccion.agroslab.com:9094/AgroslabHttpServlet/AgroslabHttpServlet").Send(params).AppendHeader("authorization", srv.authToken).EndStruct(&avgNDVI)
	if err != nil {
		return domain.TeleAvgResponse{}, err[0]
	}
	if res.StatusCode != http.StatusOK {
		return domain.TeleAvgResponse{}, apperrors.ErrInternal
	}
	return avgNDVI, nil
}
