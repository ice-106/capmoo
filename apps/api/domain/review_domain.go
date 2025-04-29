package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type ReviewDomain interface {
	CreateReview(ctx context.Context, review *model.Review) error
	GetReviews(ctx context.Context) ([]model.Review, error)
	UpdateReviewById(ctx context.Context, id string, review *model.Review) error
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

func (d *ReviewDomainImpl) GetReviews(ctx context.Context) ([]model.Review, error) {
	users, err := d.reviewRepository.GetReviews(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get reviews from ReviewDomain: %w", err)
	}
	return users, nil
}

func (d *ReviewDomainImpl) UpdateReviewById(ctx context.Context, id string, review *model.Review) error {
	if err := d.reviewRepository.UpdateReviewById(ctx, id, review); err != nil {
		return fmt.Errorf("can't update review from ReviewDomain: %w", err)
	}
	return nil
}
