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
	CreateUserConcerns(ctx context.Context, userId uint, concerns []string) error
	GetUserConcerns(ctx context.Context, userId uint) ([]model.Concern, error)
	CreateUserTravelTypes(ctx context.Context, userId uint, travelTypes []string) error
	GetUserTravelTypes(ctx context.Context, userId uint) ([]model.TravelType, error)
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

func (r *SurveyRepositoryImpl) CreateUserConcerns(ctx context.Context, userId uint, concerns []string) error {
	var foundedConcerns []model.Concern
	if err := r.db.WithContext(ctx).Where("name IN ?", concerns).Find(&foundedConcerns).Error; err != nil {
		return err
	}

	if len(foundedConcerns) == 0 {
		return fmt.Errorf("no concerns found")
	}

	var user model.User
	if err := r.db.WithContext(ctx).First(&user, userId).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	if err := r.db.WithContext(ctx).Model(&user).Association("Concerns").Append(&foundedConcerns); err != nil {
		return err
	}

	return nil
}

func (r *SurveyRepositoryImpl) GetUserConcerns(ctx context.Context, userId uint) ([]model.Concern, error) {
	var user model.User
	if err := r.db.WithContext(ctx).Preload("Concerns").First(&user, userId).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return user.Concerns, nil
}

func (r *SurveyRepositoryImpl) CreateUserTravelTypes(ctx context.Context, userId uint, travelTypes []string) error {
	var foundedTravelTypes []model.TravelType
	if err := r.db.WithContext(ctx).Where("name IN ?", travelTypes).Find(&foundedTravelTypes).Error; err != nil {
		return err
	}

	if len(foundedTravelTypes) == 0 {
		return fmt.Errorf("no travel types found")
	}

	var user model.User
	if err := r.db.WithContext(ctx).First(&user, userId).Error; err != nil {
		return fmt.Errorf("user not found: %w", err)
	}

	if err := r.db.WithContext(ctx).Model(&user).Association("TravelTypes").Append(&foundedTravelTypes); err != nil {
		return err
	}

	return nil
}

func (r *SurveyRepositoryImpl) GetUserTravelTypes(ctx context.Context, userId uint) ([]model.TravelType, error) {
	var user model.User
	if err := r.db.WithContext(ctx).Preload("TravelTypes").First(&user, userId).Error; err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	return user.TravelTypes, nil
}
