package apperrors

import "errors"

var (
	ErrNotFound         = errors.New("not_found")
	ErrIllegalOperation = errors.New("illegal_operation")
	ErrInvalidInput     = errors.New("invalid_input")
	ErrInternal         = errors.New("internal")
	ErrLoginFailed      = errors.New("login_failed")
	ErrUnauthorized     = errors.New("unauthorized")
)
