package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	CreateReview(ctx context.Context, review *model.Review) error
	GetReviewById(ctx context.Context, id uint) (*model.Review, error)
	GetReviews(ctx context.Context) ([]model.Review, error)
	GetReviewsByUserId(ctx context.Context, userId uint) ([]model.Review, error)
	GetReviewsByActivityId(ctx context.Context, activityId uint) ([]model.Review, error)
	GetAverageRatingByActivityId(ctx context.Context, activityId uint) (float64, error)
	EditReviewById(ctx context.Context, id uint, review *model.Review) error
	DeleteReviewById(ctx context.Context, id uint) error
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

func (r *ReviewRepositoryImpl) GetReviewById(ctx context.Context, id uint) (*model.Review, error) {
	var review model.Review
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&review).Error; err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepositoryImpl) GetReviews(ctx context.Context) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetReviewsByUserId(ctx context.Context, userId uint) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Where("user_id = ?", userId).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetReviewsByActivityId(ctx context.Context, activityId uint) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Where("activity_id = ?", activityId).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetAverageRatingByActivityId(ctx context.Context, activityId uint) (float64, error) {
	var averageRating float64
	if err := r.db.WithContext(ctx).Model(&model.Review{}).
		Select("AVG(rating)").
		Where("activity_id = ?", activityId).
		Scan(&averageRating).Error; err != nil {
		return 0, err
	}
	return averageRating, nil
}

func (r *ReviewRepositoryImpl) EditReviewById(ctx context.Context, id uint, review *model.Review) error {
	if err := r.db.WithContext(ctx).Model(&model.Review{}).Where("id = ?", id).Updates(review).Error; err != nil {
		return err
	}
	return nil
}

func (r *ReviewRepositoryImpl) DeleteReviewById(ctx context.Context, id uint) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Review{}).Error; err != nil {
		return err
	}
	return nil
}
