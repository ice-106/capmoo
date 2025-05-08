package dto

import "time"

type GetUsersResponse struct {
	Id        uint       `json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	OidcId    string     `json:"oidc_id"`
}
