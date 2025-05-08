package dto

type GetReviewStatisticsResponse struct {
	AverageRating float64 `json:"average_rating"`
	TotalReviews  int     `json:"total_reviews"`
	RatingCount   []int   `json:"rating_count"`
	RatingSum     int     `json:"rating_sum"`
}
