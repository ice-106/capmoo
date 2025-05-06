package dto

import "time"

type GetReviewsResponse struct {
	Id        uint       `json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`

	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
	UserId     uint   `json:"user_id"`
	ActivityId uint   `json:"activity_id"`
}
