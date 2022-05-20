package userssrv

import (
	"os"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"prakticas/backend-gpsoft/src/internal/core/ports"
	"prakticas/backend-gpsoft/src/pkg/apperrors"
	"prakticas/backend-gpsoft/src/pkg/utils"
)

type service struct {
	usersrepository ports.UsersRepository
}

func New(usersrepository ports.UsersRepository) *service {
	return &service{usersrepository: usersrepository}
}

// Checks if login is ok
// @Summary Returns all
// @Description get string by ID
// @ID get-string-by-string
// @Accept  json
// @Produce  json
// @Param id path int true "Account ID"
// @Success 200 {object} domain.User
// @Failure 400 Not found
// @Router /news/number [get]
func (srv *service) CheckLogin(username string, password string) (domain.User, error) {
	key := os.Getenv("KEY_DECRYPT_PASSWD")
	iv := os.Getenv("IV_BLOCK_PASSWD")
	user, err := srv.usersrepository.CheckLogin(username, utils.Ase256Decode(password, key, iv))
	if err != nil {
		return domain.User{}, err
	}
	return user, nil
}

func (srv *service) FetchAllUsers() ([]domain.User, error) {
	users, err := srv.usersrepository.FetchAllUsers()
	if err != nil {
		return []domain.User{}, apperrors.ErrNotFound
	}
	return users, nil
}

func (srv *service) PostNewUser(user domain.User) error {
	err := srv.usersrepository.PostNewUser(user)
	if err != nil {
		return err
	}
	return nil
}
