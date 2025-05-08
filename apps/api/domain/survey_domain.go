package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/repository"
)

type SurveyDomain interface {
	CreateUserPreferences(ctx context.Context, userId uint, preferences []string) error
	GetUserPreferences(ctx context.Context, userId uint) ([]string, error)
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
