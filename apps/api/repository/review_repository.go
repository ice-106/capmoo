package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type ReviewRepository interface {
	CreateReview(ctx context.Context, review *model.Review) error
	GetReviewById(ctx context.Context, id uint) (*model.Review, error)
	GetReviewByUserIdAndActivityId(ctx context.Context, userId, activityId uint) (*model.Review, error)
	GetReviews(ctx context.Context) ([]model.Review, error)
	GetReviewsByUserId(ctx context.Context, userId uint) ([]model.Review, error)
	GetReviewsByActivityId(ctx context.Context, activityId uint) ([]model.Review, error)
	GetReviewStatisticsByActivityId(ctx context.Context, activityId uint) (*model.ReviewStatistics, error)
	UpdateReviewById(ctx context.Context, id uint, review *model.Review) error
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
	var user model.User
	if err := r.db.WithContext(ctx).Where("id = ?", review.UserId).First(&user).Error; err != nil {
		return err
	}

	var activity model.Activity
	if err := r.db.WithContext(ctx).Where("id = ?", review.ActivityId).First(&activity).Error; err != nil {
		return err
	}

	review.User = user
	review.Activity = activity

	if err := r.db.WithContext(ctx).Create(review).Error; err != nil {
		return err
	}

	return nil
}

func (r *ReviewRepositoryImpl) GetReviewById(ctx context.Context, id uint) (*model.Review, error) {
	var review model.Review
	if err := r.db.WithContext(ctx).Preload("Activity").Preload("User").Where("id = ?", id).First(&review).Error; err != nil {
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepositoryImpl) GetReviewByUserIdAndActivityId(ctx context.Context, userId, activityId uint) (*model.Review, error) {
	var review model.Review
	if err := r.db.WithContext(ctx).Preload("Activity").Preload("User").Where("user_id = ? AND activity_id = ?", userId, activityId).First(&review).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &review, nil
}

func (r *ReviewRepositoryImpl) GetReviews(ctx context.Context) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Preload("Activity").Preload("User").Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetReviewsByUserId(ctx context.Context, userId uint) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Preload("Activity").Preload("User").Where("user_id = ?", userId).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetReviewsByActivityId(ctx context.Context, activityId uint) ([]model.Review, error) {
	var reviews []model.Review
	if err := r.db.WithContext(ctx).Preload("Activity").Preload("User").Where("activity_id = ?", activityId).Find(&reviews).Error; err != nil {
		return nil, err
	}
	return reviews, nil
}

func (r *ReviewRepositoryImpl) GetReviewStatisticsByActivityId(ctx context.Context, activityId uint) (*model.ReviewStatistics, error) {
	var statistics model.ReviewStatistics
	if err := r.db.WithContext(ctx).Model(&model.Review{}).
		Select("AVG(rating) AS average_rating, COUNT(*) AS total_reviews, SUM(rating) AS rating_sum").
		Where("activity_id = ?", activityId).
		Group("activity_id").
		Scan(&statistics).Error; err != nil {
		return nil, err
	}

	if err := r.db.WithContext(ctx).Model(&model.Review{}).
		Select("COUNT(*) AS rating_count").
		Where("activity_id = ?", activityId).
		Group("rating").
		Order("rating").
		Scan(&statistics.RatingCount).Error; err != nil {
		return nil, err
	}

	return &statistics, nil
}

func (r *ReviewRepositoryImpl) UpdateReviewById(ctx context.Context, id uint, review *model.Review) error {
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
