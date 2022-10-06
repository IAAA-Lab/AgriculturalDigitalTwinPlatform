package userssrv

import (
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	usersrepository ports.UsersRepository
}

func New(usersrepository ports.UsersRepository) *service {
	return &service{usersrepository: usersrepository}
}

func (srv *service) CheckLogin(username string, password string) (domain.User, error) {
	return srv.usersrepository.CheckLogin(username, []byte(password))
}

func (srv *service) FetchAllUsers() ([]domain.User, error) {
	return srv.usersrepository.FetchAllUsers()
}

func (srv *service) FetchUser(id primitive.ObjectID) (domain.User, error) {
	return srv.usersrepository.FetchUser(id)
}

func (srv *service) DeleteUser(id primitive.ObjectID) error {
	return srv.usersrepository.DeleteUser(id)
}

func (srv *service) PostNewUser(user domain.User) error {
	return srv.usersrepository.PostNewUser(user)
}
