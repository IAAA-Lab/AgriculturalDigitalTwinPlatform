package agroslabrepo

import "github.com/parnurzeal/gorequest"

type fieldsAemetSrv struct {
	uri       string
	authToken string
	client    *gorequest.SuperAgent
}

func NewAemetHttpConn(uri string, authToken string) *fieldsAgroslabSrv {
	return &fieldsAgroslabSrv{uri: uri, client: gorequest.New(), authToken: authToken}
}
