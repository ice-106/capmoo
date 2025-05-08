package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type ActivityDomain interface {
	GetCategories(ctx context.Context) ([]model.Category, error)
	GetLocations(ctx context.Context) ([]model.Location, error)
	GetActivityDetail(ctx context.Context, id uint) ([]model.Activity, error)
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

func (d *ActivityDomainImpl) GetCategories(ctx context.Context) ([]model.Category, error) {
	categories, err := d.activityRepository.GetCategories(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get categories from ActivityDomain: %w", err)
	}
	return categories, nil
}

func (d *ActivityDomainImpl) GetLocations(ctx context.Context) ([]model.Location, error) {
	locations, err := d.activityRepository.GetLocations(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get locations from ActivityDomain: %w", err)
	}
	return locations, nil
}

func (d *ActivityDomainImpl) GetActivityDetail(ctx context.Context, id uint) ([]model.Activity, error) {
	activities, err := d.activityRepository.GetActivityDetail(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("can't get activity detail from ActivityDomain: %w", err)
	}
	return activities, nil
}

func (d *ActivityDomainImpl) GetActivitiesByFilters(ctx context.Context, searchTerm string, locations []uint, minPrice, maxPrice *float64, categories []uint) ([]model.Activity, error) {
	user, err := d.activityRepository.GetActivitiesByFilters(ctx, searchTerm, locations, minPrice, maxPrice, categories)
	if err != nil {
		return nil, fmt.Errorf("can't get activities from ActivityDomain: %w", err)
	}
	return user, nil
}
