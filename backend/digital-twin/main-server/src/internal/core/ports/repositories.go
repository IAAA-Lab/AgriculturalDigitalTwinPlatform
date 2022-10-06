package ports

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NewsRepository interface {
	FetchNumber() (int64, error)
	FetchAll(numPage int64) ([]domain.News, error)
	Fetch(id primitive.ObjectID) (domain.News, error)
	PostNewNews(news domain.News) error
	UpdateNews(id primitive.ObjectID, news domain.News) error
	DeleteNews(id primitive.ObjectID) error
}

type UsersRepository interface {
	CheckLogin(username string, password []byte) (domain.User, error)
	FetchAllUsers() ([]domain.User, error)
	FetchUser(id primitive.ObjectID) (domain.User, error)
	DeleteUser(id primitive.ObjectID) error
	PostNewUser(user domain.User) error
}

type ParcelsRepository interface {
	GetParcels(parcelRefs []domain.ParcelRefs, anyo int) ([]domain.Parcel, error)
	GetParcelsRef(userId primitive.ObjectID) ([]domain.ParcelRefs, error)
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

type BrokerRepository interface {
	Publish(topic string, routingKey string, message []byte) error
	Subscribe(queueName string, exchangeName string, consumerName string, out chan<- amqp.Delivery)
}

type FileStorageRepository interface {
	GetFile(fileName string, path string) ([]byte, error)
	UploadImage(image []byte, fileName string, path string) (string, error)
	DeleteFile(fileName string, path string) error
}
