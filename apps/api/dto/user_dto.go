package dto

import "time"

type GetUserResponse struct {
	Id        uint       `json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	OidcId    string     `json:"oidc_id"`
}

type UpdateUserByIdRequest struct {
	Name  string `json:"name"`
	Email string `json:"email" validate:"omitempty,email"`
}

type UpdateUserByIdResponse struct {
	Id        uint       `json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	OidcId    string     `json:"oidc_id"`
}
