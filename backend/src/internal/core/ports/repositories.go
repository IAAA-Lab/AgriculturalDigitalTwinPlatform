package ports

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewsRepository interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id primitive.ObjectID) (domain.Description, error)
	PostNewNews(news domain.PostNews) error
	UpdateNews(id primitive.ObjectID, news domain.PostNews) error
	DeleteNews(id primitive.ObjectID) error
}

type UsersRepository interface {
	CheckLogin(username string, password []byte) (domain.User, error)
	FetchAllUsers() ([]domain.UserNoPasswd, error)
	FetchUser(id primitive.ObjectID) (domain.UserNoPasswd, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type FieldsWeatherRepository interface {
}

type FieldsAPIRepository interface {
	GetGeneralInfoByUser(params domain.UserParcelParams) (domain.UserParcelResponse, error)
	GetParcels(params domain.ParcelParams) (domain.ParcelResponse, error)
	GetEnclosures(params domain.EnclosureParams) (domain.EnclosureResponse, error)
	GetAvgNDVI(params domain.TeleAvgParams) (domain.TeleAvgResponse, error)
	// GetNVDI(params domain.TeleParams) ()s
}

type FieldsPersistenceRepository interface {
	GetParcels(parcelRefs []domain.ParcelRefs, anyo int) ([]domain.Parcel, error)
	GetParcelsRef(userId primitive.ObjectID) ([]domain.ParcelRefs, error)
	//GetNDVI(parcelId string) (domain.NDVI, error)
	//PostNDVI(ndvis []float32) error
	PostParcelsAndEnclosures(userId primitive.ObjectID, parcelRefs []domain.ParcelRefs) error
	PostParcel(parcel domain.Parcel) error
}

type EncryptionRepository interface {
	EncryptData(data string) (string, error)
	DecryptData(data string) (string, error)
}

type CacheRepository interface {
	Get(key string) (string, error)
	Set(key string, value string, exp time.Duration) error
	Delete(key string) error
}
