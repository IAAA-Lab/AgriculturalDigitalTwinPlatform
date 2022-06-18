package newssrv

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	newsrepository ports.NewsRepository
}

func New(newsRepository ports.NewsRepository) *service {
	return &service{newsrepository: newsRepository}
}

// Get godoc
// @Summary Returns all
// @Description get string by ID
// @ID get-string-by-string
// @Accept  json
// @Produce  json
// @Param id path int true "Account ID"
// @Success 200 {object} domain.New
// @Failure 400 Not found
// @Router /news/{id} [get]
func (srv *service) FetchAll(numPage int64) ([]domain.News, error) {
	new, err := srv.newsrepository.FetchAll(numPage)
	if err != nil {
		return []domain.News{}, apperrors.ErrNotFound
	}

	return new, nil
}

// Get godoc
// @Summary Te devuelve un libro
// @Description get string by ID
// @ID get-string-by-string
// @Accept  json
// @Produce  json
// @Param id path int true "Account ID"
// @Success 200 {object} domain.New
// @Failure 400 Not found
// @Router /news/{id} [get]
func (srv *service) Fetch(id primitive.ObjectID) (domain.Description, error) {
	description, err := srv.newsrepository.Fetch(id)
	if err != nil {
		return domain.Description{}, apperrors.ErrNotFound
	}

	return description, nil
}

// Get godoc
// @Summary Returns all
// @Description get string by ID
// @ID get-string-by-string
// @Accept  json
// @Produce  json
// @Param id path int true "Account ID"
// @Success 200 {object} int64
// @Failure 400 Not found
// @Router /news/number [get]
func (srv *service) FetchNumber() (int64, error) {
	number, err := srv.newsrepository.FetchNumber()
	if err != nil {
		return 0, apperrors.ErrNotFound
	}

	return number, nil
}

// Post new news
// @Summary Returns all
// @Description get string by ID
// @ID get-string-by-string
// @Accept  json
// @Produce  json
// @Param id path int true "Account ID"
// @Success 200 {object} nill
// @Failure 400 Not found
// @Router /news [post]
func (srv *service) PostNewNews(news domain.PostNews) error {
	err := srv.newsrepository.PostNewNews(news)
	if err != nil {
		return err
	}
	return nil
}
