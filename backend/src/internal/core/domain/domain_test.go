package domain_test

import (
	"testing"

	"prakticas/backend-gpsoft/src/internal/core/domain"

	"github.com/stretchr/testify/assert"
)

func TestNewBook(t *testing.T) {
	type args struct {
		id   string
		name string
	}
	tests := []struct {
		name string
		args args
		want domain.Book
	}{
		{"Prueba 1", args{"1", "name"}, domain.Book{ID: "1", Name: "name", Published: false}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res := domain.NewBook(tt.args.id, tt.args.name)
			assert.Equal(t, tt.want, res)
			assert.Equal(t, false, res.IsPublished())

		})
	}
}
