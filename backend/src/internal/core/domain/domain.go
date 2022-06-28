package domain

import (
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID `bson:"_id"`
	Username string             `bson:"username"`
	Password string             `bson:"passwd"`
	Role     string             `bson:"role"`
}
type UserNoPasswd struct {
	ID       primitive.ObjectID `bson:"_id"`
	Username string             `bson:"username"`
	Role     string             `bson:"role"`
}
type News struct {
	ID                primitive.ObjectID `bson:"_id"`
	Title             string             `bson:"title"`
	LittleDescription string             `json:"little_description"`
	Author            string             `bson:"author"`
	Date              primitive.DateTime `bson:"date"`
	ReadMin           uint8              `json:"read_min"`
	Image             string             `bson:"image"`
}

type PostNews struct {
	Title             string             `bson:"title"`
	LittleDescription string             `json:"little_description"`
	Author            string             `bson:"author"`
	Date              primitive.DateTime `bson:"date"`
	Image             string             `json:"image,omitempty" bson:"image,omitempty"`
	ReadMin           uint8              `json:"read_min"`
	Content           string             `bson:"content"`
}
type Description struct {
	Content string `bson:"content"`
}

type AuthCustomClaims struct {
	User_id string `json:"user_id"`
	User    string `json:"user"`
	Role    string `json:"role"`
	jwt.StandardClaims
}

type EncrytedData struct {
	Data string `bson:"data"`
}

const (
	Admin      = "admin"
	NewsEditor = "newsEditor"
	Plain      = "user"
	Agrarian   = "agrarian"
)
