package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type ReviewDomain interface {
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

type ReviewDomainImpl struct {
	reviewRepository repository.ReviewRepository
}

var _ ReviewDomain = &ReviewDomainImpl{}

func NewReviewDomain(reviewRepository repository.ReviewRepository) *ReviewDomainImpl {
	return &ReviewDomainImpl{
		reviewRepository: reviewRepository,
	}
}

func (d *ReviewDomainImpl) CreateReview(ctx context.Context, review *model.Review) error {
	if err := d.reviewRepository.CreateReview(ctx, review); err != nil {
		return fmt.Errorf("can't create review from ReviewDomain: %w", err)
	}
	return nil
}

func (d *ReviewDomainImpl) GetReviewById(ctx context.Context, id uint) (*model.Review, error) {
	review, err := d.reviewRepository.GetReviewById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("can't get review from ReviewDomain: %w", err)
	}
	return review, nil
}

func (d *ReviewDomainImpl) GetReviewByUserIdAndActivityId(ctx context.Context, userId, activityId uint) (*model.Review, error) {
	review, err := d.reviewRepository.GetReviewByUserIdAndActivityId(ctx, userId, activityId)
	if err != nil {
		return nil, fmt.Errorf("can't get review by user id and activity id from ReviewDomain: %w", err)
	}
	return review, nil
}

func (d *ReviewDomainImpl) GetReviews(ctx context.Context) ([]model.Review, error) {
	reviews, err := d.reviewRepository.GetReviews(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get reviews from ReviewDomain: %w", err)
	}
	return reviews, nil
}

func (d *ReviewDomainImpl) GetReviewsByUserId(ctx context.Context, userId uint) ([]model.Review, error) {
	reviews, err := d.reviewRepository.GetReviewsByUserId(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get reviews by user id from ReviewDomain: %w", err)
	}
	return reviews, nil
}

func (d *ReviewDomainImpl) GetReviewsByActivityId(ctx context.Context, activityId uint) ([]model.Review, error) {
	reviews, err := d.reviewRepository.GetReviewsByActivityId(ctx, activityId)
	if err != nil {
		return nil, fmt.Errorf("can't get reviews by activity id from ReviewDomain: %w", err)
	}
	return reviews, nil
}

func (d *ReviewDomainImpl) GetReviewStatisticsByActivityId(ctx context.Context, activityId uint) (*model.ReviewStatistics, error) {
	reviewStatistics, err := d.reviewRepository.GetReviewStatisticsByActivityId(ctx, activityId)
	if err != nil {
		return nil, fmt.Errorf("can't get review statistics by activity id from ReviewDomain: %w", err)
	}
	return reviewStatistics, nil
}

func (d *ReviewDomainImpl) UpdateReviewById(ctx context.Context, id uint, review *model.Review) error {
	if err := d.reviewRepository.UpdateReviewById(ctx, id, review); err != nil {
		return fmt.Errorf("can't edit review from ReviewDomain: %w", err)
	}
	return nil
}

func (d *ReviewDomainImpl) DeleteReviewById(ctx context.Context, id uint) error {
	if err := d.reviewRepository.DeleteReviewById(ctx, id); err != nil {
		return fmt.Errorf("can't delete review from ReviewDomain: %w", err)
	}
	return nil
}
