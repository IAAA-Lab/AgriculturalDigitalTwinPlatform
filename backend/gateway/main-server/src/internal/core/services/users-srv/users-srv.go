package userssrv

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type service struct {
	usersrepository ports.UsersRepository
}

func New(usersrepository ports.UsersRepository) *service {
	return &service{usersrepository: usersrepository}
}

func (srv *service) CheckLogin(email string, password string) (domain.User, error) {
	user, err := srv.usersrepository.FetchUserByEmail(email)
	if err != nil {
		return domain.User{}, err
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return domain.User{}, apperrors.ErrLoginFailed
	}
	user.Password = ""
	return user, nil
}

func (srv *service) FetchAllUsers() ([]domain.User, error) {
	return srv.usersrepository.FetchAllUsers()
}

func (srv *service) FetchUser(id string) (domain.User, error) {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return domain.User{}, err
	}
	return srv.usersrepository.FetchUser(idObj)
}

func (srv *service) DeleteUser(id string) error {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return srv.usersrepository.DeleteUser(idObj)
}

func (srv *service) PostNewUser(user domain.User) error {
	_, err := srv.usersrepository.FetchUserByEmail(user.Email)
	if err == nil {
		return apperrors.ErrUserExists
	}
	encryptedPasswd, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return apperrors.ErrInternal
	}
	user.Password = string(encryptedPasswd)
	return srv.usersrepository.PostNewUser(user)
}
