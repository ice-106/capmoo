package model

import "github.com/lib/pq"

type Review struct {
	Model

	Rating  int            `gorm:"not null;check:rating >= 1 AND rating <= 5"`
	Comment string         `gorm:"not null"`
	Images  pq.StringArray `gorm:"type:text[];not null"`

	UserId     uint     `gorm:"not null"`
	User       User     `gorm:"foreignKey:UserId"`
	ActivityId uint     `gorm:"not null"`
	Activity   Activity `gorm:"foreignKey:ActivityId"`
}

func (Review) TableName() string {
	return "reviews"
}

type ReviewStatistics struct {
	AverageRating float64 `json:"average_rating"`
	TotalReviews  int     `json:"total_reviews"`
	RatingCount   []int   `json:"rating_count"`
	RatingSum     int     `json:"rating_sum"`
}
