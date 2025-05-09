package mocks

import (
	"context"

	"github.com/capmoo/api/model"
	"github.com/stretchr/testify/mock"
)

type MockReviewRepository struct {
	mock.Mock
}

func (m *MockReviewRepository) GetReviewStatisticsByActivityId(ctx context.Context, activityId uint) (*model.ReviewStatistics, error) {
	args := m.Called(ctx, activityId)
	return args.Get(0).(*model.ReviewStatistics), args.Error(1)
}

// Add empty method stubs for all other interface methods to satisfy it
func (m *MockReviewRepository) CreateReview(context.Context, *model.Review) error                       { return nil }
func (m *MockReviewRepository) GetReviewById(context.Context, uint) (*model.Review, error)             { return nil, nil }
func (m *MockReviewRepository) GetReviewByUserIdAndActivityId(context.Context, uint, uint) (*model.Review, error) {
	return nil, nil
}
func (m *MockReviewRepository) GetReviews(context.Context) ([]model.Review, error)                     { return nil, nil }
func (m *MockReviewRepository) GetReviewsByUserId(context.Context, uint) ([]model.Review, error)       { return nil, nil }
func (m *MockReviewRepository) GetReviewsByActivityId(context.Context, uint) ([]model.Review, error)   { return nil, nil }
func (m *MockReviewRepository) UpdateReviewById(context.Context, uint, *model.Review) error            { return nil }
func (m *MockReviewRepository) DeleteReviewById(context.Context, uint) error                           { return nil }
