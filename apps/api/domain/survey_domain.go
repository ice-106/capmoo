package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/repository"
)

type SurveyDomain interface {
	CreateUserPreferences(ctx context.Context, userId uint, preferences []string) error
	GetUserPreferences(ctx context.Context, userId uint) ([]string, error)
	CreateUserConcerns(ctx context.Context, userId uint, concerns []string) error
	GetUserConcerns(ctx context.Context, userId uint) ([]string, error)
	CreateUserTravelTypes(ctx context.Context, userId uint, travelTypes []string) error
	GetUserTravelTypes(ctx context.Context, userId uint) ([]string, error)
}

type SurveyDomainImpl struct {
	surveyRepository repository.SurveyRepository
}

var _ SurveyDomain = &SurveyDomainImpl{}

func NewSurveyDomain(surveyRepository repository.SurveyRepository) *SurveyDomainImpl {
	return &SurveyDomainImpl{
		surveyRepository: surveyRepository,
	}
}

func (d *SurveyDomainImpl) CreateUserPreferences(ctx context.Context, userId uint, preferences []string) error {
	if err := d.surveyRepository.CreateUserPreferences(ctx, userId, preferences); err != nil {
		return fmt.Errorf("can't create user preferences from SurveyDomain: %w", err)
	}
	return nil
}

func (d *SurveyDomainImpl) GetUserPreferences(ctx context.Context, userId uint) ([]string, error) {
	preferences, err := d.surveyRepository.GetUserPreferences(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get user preferences from SurveyDomain: %w", err)
	}

	var preferenceNames []string
	for _, preference := range preferences {
		preferenceNames = append(preferenceNames, preference.Name)
	}

	return preferenceNames, nil
}

func (d *SurveyDomainImpl) CreateUserConcerns(ctx context.Context, userId uint, concerns []string) error {
	if err := d.surveyRepository.CreateUserConcerns(ctx, userId, concerns); err != nil {
		return fmt.Errorf("can't create user concerns from SurveyDomain: %w", err)
	}
	return nil
}

func (d *SurveyDomainImpl) GetUserConcerns(ctx context.Context, userId uint) ([]string, error) {
	concerns, err := d.surveyRepository.GetUserConcerns(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get user concerns from SurveyDomain: %w", err)
	}

	var concernNames []string
	for _, concern := range concerns {
		concernNames = append(concernNames, concern.Name)
	}

	return concernNames, nil
}

func (d *SurveyDomainImpl) CreateUserTravelTypes(ctx context.Context, userId uint, travelTypes []string) error {
	if err := d.surveyRepository.CreateUserTravelTypes(ctx, userId, travelTypes); err != nil {
		return fmt.Errorf("can't create user travel types from SurveyDomain: %w", err)
	}
	return nil
}

func (d *SurveyDomainImpl) GetUserTravelTypes(ctx context.Context, userId uint) ([]string, error) {
	travelTypes, err := d.surveyRepository.GetUserTravelTypes(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get user travel types from SurveyDomain: %w", err)
	}

	var travelTypeNames []string
	for _, travelType := range travelTypes {
		travelTypeNames = append(travelTypeNames, travelType.Name)
	}

	return travelTypeNames, nil
}
