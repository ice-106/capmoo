package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type UserDomain interface {
	CreateUserIfNotExists(ctx context.Context, user *model.User) (*model.User, error)
	GetUsers(ctx context.Context) ([]model.User, error)
}

type UserDomainImpl struct {
	userRepository repository.UserRepository
}

var _ UserDomain = &UserDomainImpl{}

func NewUserDomain(userRepository repository.UserRepository) *UserDomainImpl {
	return &UserDomainImpl{
		userRepository: userRepository,
	}
}

func (d *UserDomainImpl) CreateUserIfNotExists(ctx context.Context, user *model.User) (*model.User, error) {
	createdUser, err := d.userRepository.CreateIfNotExists(ctx, user)
	if err != nil {
		return nil, fmt.Errorf("can't create user from UserDomain: %w", err)
	}
	return createdUser, nil
}

func (d *UserDomainImpl) GetUsers(ctx context.Context) ([]model.User, error) {
	users, err := d.userRepository.GetUsers(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get users from UserDomain: %w", err)
	}
	return users, nil
}
