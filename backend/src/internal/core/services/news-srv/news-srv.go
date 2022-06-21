package newssrv

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	newsrepository ports.NewsRepository
}

func New(newsRepository ports.NewsRepository) *service {
	return &service{newsrepository: newsRepository}
}

func (srv *service) FetchAll(numPage int64) ([]domain.News, error) {
	return srv.newsrepository.FetchAll(numPage)
}

func (srv *service) Fetch(id primitive.ObjectID) (domain.Description, error) {
	return srv.newsrepository.Fetch(id)
}

func (srv *service) FetchNumber() (int64, error) {
	return srv.newsrepository.FetchNumber()
}

func (srv *service) PostNewNews(news domain.PostNews) error {
	return srv.newsrepository.PostNewNews(news)
}
