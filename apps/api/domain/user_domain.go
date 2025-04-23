package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type UserDomain interface {
	GetUsers(ctx context.Context) ([]model.User, error)
	ArchiveActivity(ctx context.Context, userId uint, activityId uint) error
}

type UserDomainImpl struct {
	userRepository repository.UserRepository
}

var _ UserDomain = &UserDomainImpl{}

func NewUserDomain(userDomain repository.UserRepository) *UserDomainImpl {
	return &UserDomainImpl{
		userRepository: userDomain,
	}
}

func (d *UserDomainImpl) GetUsers(ctx context.Context) ([]model.User, error) {
	users, err := d.userRepository.GetUsers(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get users from UserDomain: %w", err)
	}
	return users, nil
}

func (d *UserDomainImpl) ArchiveActivity(ctx context.Context, userId uint, activityId uint) error {
	return d.userRepository.ArchiveActivity(ctx, userId, activityId)
}
