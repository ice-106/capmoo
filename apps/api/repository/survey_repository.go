package repository

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type SurveyRepository interface {
	CreateUserPreferences(ctx context.Context, userId uint, preferences []string) error
	GetUserPreferences(ctx context.Context, userId uint) ([]model.Preference, error)
}

type SurveyRepositoryImpl struct {
	db *gorm.DB
}

var _ SurveyRepository = &SurveyRepositoryImpl{}

func NewSurveyRepository(db *gorm.DB) *SurveyRepositoryImpl {
	return &SurveyRepositoryImpl{
		db: db,
	}
}

func (r *SurveyRepositoryImpl) CreateUserPreferences(ctx context.Context, userId uint, preferences []string) error {
	var foundedPreferences []model.Preference
	if err := r.db.WithContext(ctx).Where("name IN ?", preferences).Find(&foundedPreferences).Error; err != nil {
		return err
	}

	if len(foundedPreferences) == 0 {
		return fmt.Errorf("no preferences found")
	}

	var user model.User
	if err := r.db.WithContext(ctx).First(&user, userId).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	if err := r.db.WithContext(ctx).Model(&user).Association("Preferences").Append(&foundedPreferences); err != nil {
		return err
	}

	return nil
}

func (r *SurveyRepositoryImpl) GetUserPreferences(ctx context.Context, userId uint) ([]model.Preference, error) {
	var user model.User
	if err := r.db.WithContext(ctx).Preload("Preferences").First(&user, userId).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return user.Preferences, nil
}
