package domain

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID           primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email        string             `json:"email"`
	Password     string             `json:"password"`
	Role         string             `json:"role"`
	EnclosureIds []string           `json:"enclosureIds"`
}
