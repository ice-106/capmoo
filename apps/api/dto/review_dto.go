package dto

type CreateReviewRequest struct {
	Rating     int    `json:"rating" validate:"required,gte=1,lte=5" example:"4"`
	Comment    string `json:"comment" validate:"required" example:"Great experience!"`
	ActivityId uint   `json:"activity_id" validate:"required"`
}

type GetReviewResponse struct {
	Id         uint   `json:"id"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
	Rating     int    `json:"rating"`
	Comment    string `json:"comment"`
	UserId     uint   `json:"user_id"`
	User       string `json:"user"`
	ActivityId uint   `json:"activity_id"`
	Activity   string `json:"activity"`
}

type GetReviewStatisticsResponse struct {
	AverageRating float64 `json:"average_rating"`
	TotalReviews  int     `json:"total_reviews"`
	RatingCount   []int   `json:"rating_count"`
	RatingSum     int     `json:"rating_sum"`
}
