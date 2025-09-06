package domain_test

import (
	"context"
	"testing"

	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/model"
	"github.com/capmoo/api/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetReviewStatisticsByActivityId(t *testing.T) {
	ctx := context.Background()
	mockRepo := new(mocks.MockReviewRepository)
	domainImpl := domain.NewReviewDomain(mockRepo)

	expectedStats := &model.ReviewStatistics{
		AverageRating: 4.5,
		TotalReviews:  10,
		RatingSum:     45,
		RatingCount:   []int{4, 6}, // Just a slice of int, not a struct
	}

	mockRepo.On("GetReviewStatisticsByActivityId", mock.Anything, uint(1)).
		Return(expectedStats, nil)

	result, err := domainImpl.GetReviewStatisticsByActivityId(ctx, 1)

	assert.NoError(t, err)
	assert.Equal(t, expectedStats, result)

	mockRepo.AssertExpectations(t)
}
