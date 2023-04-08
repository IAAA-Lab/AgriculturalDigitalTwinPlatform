package services

import (
	"digital-twin/main-server/src/internal/core/domain"
	"digital-twin/main-server/src/internal/core/ports"
	"digital-twin/main-server/src/pkg/apperrors"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type usersService struct {
	usersrepository ports.UsersRepository
}

func NewUsersService(usersrepository ports.UsersRepository) *usersService {
	return &usersService{usersrepository: usersrepository}
}

func (srv *usersService) CheckLogin(email string, password string) (domain.User, error) {
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

func (srv *usersService) FetchAllUsers() ([]domain.User, error) {
	return srv.usersrepository.FetchAllUsers()
}

func (srv *usersService) FetchUser(id string) (domain.User, error) {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return domain.User{}, err
	}
	return srv.usersrepository.FetchUser(idObj)
}

func (srv *usersService) FetchUserByEmail(email string) (domain.User, error) {
	return srv.usersrepository.FetchUserByEmail(email)
}

func (srv *usersService) DeleteUser(id string) error {
	idObj, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	return srv.usersrepository.DeleteUser(idObj)
}

func (srv *usersService) PostNewUser(user domain.User) error {
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

func (srv *usersService) PostEnclosure(email string, enclosureIds []string) error {
	return srv.usersrepository.PostEnclosure(email, enclosureIds)
}
