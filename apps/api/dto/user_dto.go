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

type CreateUserReviewRequest struct {
	Rating     int    `json:"rating" validate:"required,gte=1,lte=5" example:"4"`
	Comment    string `json:"comment" validate:"required" example:"Great experience!"`
	ActivityId uint   `json:"activity_id" validate:"required"`
}

type GetUserReviewsResponse struct {
	Id         uint            `json:"id"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  *time.Time      `json:"updated_at"`
	Rating     int             `json:"rating"`
	Comment    string          `json:"comment"`
	UserId     uint            `json:"user_id"`
	User       GetUserResponse `json:"user"`
	ActivityId uint            `json:"activity_id"`
	// Activity   GetActivityResponse     `json:"activity"` // TODO: add activity response struct
}
