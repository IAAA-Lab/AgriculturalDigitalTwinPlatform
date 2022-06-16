package domain

import (
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id,omitempty"`
	Username string             `bson:"username,omitempty"`
	Password string             `bson:"passwd,omitempty"`
	Role     string             `bson:"role"`
}
type UserNoPasswd struct {
	ID       primitive.ObjectID `bson:"_id"`
	Username string             `bson:"username,omitempty"`
	Role     string             `bson:"role"`
}
type New struct {
	ID                primitive.ObjectID `bson:"_id,omitempty"`
	Title             string             `bson:"title,omitempty"`
	LittleDescription string             `bson:"little_description,omitempty"`
	Author            string             `bson:"author,omitempty"`
	Date              primitive.DateTime `bson:"date,omitempty"`
	Image             string             `bson:"image"`
}

type PostNew struct {
	Title             string             `bson:"title,omitempty"`
	LittleDescription string             `bson:"little_description,omitempty"`
	Author            string             `bson:"author,omitempty"`
	Date              primitive.DateTime `bson:"date,omitempty"`
	Image             string             `bson:"image"`
	Content           string             `bson:"content"`
}

type Description struct {
	Content string `bson:"content,omitempty"`
}

type AuthCustomClaims struct {
	User_id string `json:"user_id"`
	User    string `json:"user"`
	Role    string `json:"role"`
	jwt.StandardClaims
}

const (
	Admin    = "admin"
	Editor   = "editor"
	Plain    = "user"
	Agrarian = "agrarian"
)
