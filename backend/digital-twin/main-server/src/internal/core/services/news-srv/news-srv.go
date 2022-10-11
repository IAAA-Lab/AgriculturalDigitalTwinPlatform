package newssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"

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

func (srv *service) Fetch(id string) (domain.News, error) {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return domain.News{}, err
	}
	return srv.newsrepository.Fetch(idObj)
}

func (srv *service) FetchNumber() (int64, error) {
	return srv.newsrepository.FetchNumber()
}

func (srv *service) PostNewNews(news domain.News) error {
	return srv.newsrepository.PostNewNews(news)
}

func (srv *service) UpdateNews(id string, news domain.News) error {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return srv.newsrepository.UpdateNews(idObj, news)
}

func (srv *service) DeleteNews(id string) error {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return srv.newsrepository.DeleteNews(idObj)
}
