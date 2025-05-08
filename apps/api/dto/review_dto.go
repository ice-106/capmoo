package dto

import "time"

type CreateUserReviewRequest struct {
	Rating     int    `json:"rating" validate:"required,gte=1,lte=5" example:"4"`
	Comment    string `json:"comment" validate:"required" example:"Great experience!"`
	ActivityId uint   `json:"activity_id" validate:"required"`
}

type GetUserReviewsResponse struct {
	Id         uint                `json:"id"`
	CreatedAt  time.Time           `json:"created_at"`
	UpdatedAt  *time.Time          `json:"updated_at"`
	Rating     int                 `json:"rating"`
	Comment    string              `json:"comment"`
	UserId     uint                `json:"user_id"`
	User       GetUserResponse     `json:"user"`
	ActivityId uint                `json:"activity_id"`
	Activity   GetActivityResponse `json:"activity"`
}

type GetReviewStatisticsResponse struct {
	AverageRating float64 `json:"average_rating"`
	TotalReviews  int     `json:"total_reviews"`
	RatingCount   []int   `json:"rating_count"`
	RatingSum     int     `json:"rating_sum"`
}

type UpdateUserReviewRequest struct {
	Rating  int    `json:"rating" example:"4"`
	Comment string `json:"comment" example:"Great experience!"`
}

type UpdateUserReviewResponse struct {
	Id         uint                `json:"id"`
	CreatedAt  time.Time           `json:"created_at"`
	UpdatedAt  *time.Time          `json:"updated_at"`
	Rating     int                 `json:"rating"`
	Comment    string              `json:"comment"`
	UserId     uint                `json:"user_id"`
	User       GetUserResponse     `json:"user"`
	ActivityId uint                `json:"activity_id"`
	Activity   GetActivityResponse `json:"activity"`
}
