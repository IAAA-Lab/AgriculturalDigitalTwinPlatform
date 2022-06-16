package userssrv

import (
	"os"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"prakticas/backend-gpsoft/src/pkg/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type service struct {
	usersrepository ports.UsersRepository
}

func New(usersrepository ports.UsersRepository) *service {
	return &service{usersrepository: usersrepository}
}

func (srv *service) CheckLogin(username string, password string) (domain.User, error) {
	key := os.Getenv("KEY_DECRYPT_PASSWD")
	iv := os.Getenv("IV_BLOCK_PASSWD")
	user, err := srv.usersrepository.CheckLogin(username, utils.Ase256Decode(password, key, iv))
	if err != nil {
		return domain.User{}, err
	}
	return user, nil
}

func (srv *service) FetchAllUsers() ([]domain.UserNoPasswd, error) {
	users, err := srv.usersrepository.FetchAllUsers()
	if err != nil {
		return []domain.UserNoPasswd{}, apperrors.ErrNotFound
	}
	return users, nil
}

func (srv *service) FetchUser(id primitive.ObjectID) (domain.UserNoPasswd, error) {
	user, err := srv.usersrepository.FetchUser(id)
	if err != nil {
		return domain.UserNoPasswd{}, err
	}
	return user, nil
}

func (srv *service) DeleteUser(id primitive.ObjectID) error {
	err := srv.usersrepository.DeleteUser(id)
	if err != nil {
		return err
	}
	return nil
}

func (srv *service) PostNewUser(user domain.User) error {
	err := srv.usersrepository.PostNewUser(user)
	if err != nil {
		return err
	}
	return nil
}
