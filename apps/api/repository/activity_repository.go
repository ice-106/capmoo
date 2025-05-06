package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type ActivityRepository interface {
	GetActivitiesByFilters(ctx context.Context, searchTerm string, locations []uint, minPrice *float64, maxPrice *float64, categories []uint) ([]model.Activity, error)
}

type ActivityRepositoryImpl struct {
	db *gorm.DB
}

func NewActivityRepository(db *gorm.DB) *ActivityRepositoryImpl {
	return &ActivityRepositoryImpl{
		db: db,
	}
}

var _ ActivityRepository = &ActivityRepositoryImpl{}

func (r *ActivityRepositoryImpl) GetActivitiesByFilters(ctx context.Context, searchTerm string, locations []uint, minPrice, maxPrice *float64, categories []uint) ([]model.Activity, error) {
	var activities []model.Activity
	query := r.db.WithContext(ctx).Model(&model.Activity{})

	if searchTerm != "" {
		query = query.Where("name ILIKE ? OR description ILIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%")
	}
	if len(locations) > 0 {
		query = query.Where("location_id IN ?", locations)
	}
	if minPrice != nil {
		query = query.Where("price >= ?", *minPrice)
	}
	if maxPrice != nil {
		query = query.Where("price <= ?", *maxPrice)
	}
	if len(categories) > 0 {
		query = query.Where("category_id IN ?", categories)
	}

	if err := query.Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}
