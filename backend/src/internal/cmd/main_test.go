package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"prakticas/backend-gpsoft/src/internal/core/domain"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPingRoute(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, "pong", w.Body.String())
}

func TestCreateBook(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()
	jsonBody := map[string]string{
		"id":   "1",
		"name": "quijote",
	}
	postBody, _ := json.Marshal(jsonBody)
	responseBody := bytes.NewBuffer(postBody)

	req, _ := http.NewRequest("POST", "/save", responseBody)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)

	want := domain.NewBook("1", "quijote")
	wantedJson, _ := json.Marshal(want)
	assert.Equal(t, bytes.NewBuffer(wantedJson), w.Body)
}

func TestGetBook(t *testing.T) {
	router := setupRouter()

	w := httptest.NewRecorder()

	jsonBody := map[string]string{
		"id":   "1",
		"name": "quijote",
	}
	postBody, _ := json.Marshal(jsonBody)
	responseBody := bytes.NewBuffer(postBody)

	req, _ := http.NewRequest("POST", "/save", responseBody)
	router.ServeHTTP(w, req)

	want := domain.NewBook("1", "quijote")
	wantedJson, _ := json.Marshal(want)
	assert.Equal(t, bytes.NewBuffer(wantedJson), w.Body)
	
	w = httptest.NewRecorder()

	req, _ = http.NewRequest("GET", "/book/1", nil)
	router.ServeHTTP(w, req)

	assert.Equal(t, 200, w.Code)
	assert.Equal(t, bytes.NewBuffer(wantedJson), w.Body)
}
