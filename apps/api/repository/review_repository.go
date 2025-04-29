package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	CreateReview(ctx context.Context, review *model.Review) error
	GetReviews(ctx context.Context) ([]model.Review, error)
	UpdateReviewById(ctx context.Context, id string, review *model.Review) error
}

type ReviewRepositoryImpl struct {
	db *gorm.DB
}

var _ ReviewRepository = &ReviewRepositoryImpl{}

func NewReviewRepository(db *gorm.DB) *ReviewRepositoryImpl {
	return &ReviewRepositoryImpl{
		db: db,
	}
}

func (r *ReviewRepositoryImpl) CreateReview(ctx context.Context, review *model.Review) error {
	if err := r.db.WithContext(ctx).Create(review).Error; err != nil {
		return err
	}
	return nil
}

func (r *ReviewRepositoryImpl) GetReviews(ctx context.Context) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) UpdateReviewById(ctx context.Context, id string, review *model.Review) error {
	if err := r.db.WithContext(ctx).Model(&model.Review{}).Where("id = ?", id).Updates(review).Error; err != nil {
		return err
	}
	return nil
}
