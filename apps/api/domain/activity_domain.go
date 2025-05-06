package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type ActivityDomain interface {
	GetActivitiesByFilters(ctx context.Context, searchTerm string, locations []uint, minPrice *float64, maxPrice *float64, categories []uint) ([]model.Activity, error)
}

type ActivityDomainImpl struct {
	activityRepository repository.ActivityRepository
}

var _ ActivityDomain = &ActivityDomainImpl{}

func NewActivityDomain(activityRepository repository.ActivityRepository) *ActivityDomainImpl {
	return &ActivityDomainImpl{
		activityRepository: activityRepository,
	}
}

func (d *ActivityDomainImpl) GetActivitiesByFilters(ctx context.Context, searchTerm string, locations []uint, minPrice, maxPrice *float64, categories []uint) ([]model.Activity, error) {
	user, err := d.activityRepository.GetActivitiesByFilters(ctx, searchTerm, locations, minPrice, maxPrice, categories)
	if err != nil {
		return nil, fmt.Errorf("can't get activities from ActivityDomain: %w", err)
	}
	return user, nil
}
