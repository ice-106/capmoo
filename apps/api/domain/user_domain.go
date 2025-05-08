package domain

import (
	"context"
	"fmt"

	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
)

type UserDomain interface {
	CreateUserIfNotExists(ctx context.Context, user *model.User) (*model.User, error)
	GetUserById(ctx context.Context, id uint) (*model.User, error)
	GetUsers(ctx context.Context) ([]model.User, error)
	UpdateUserById(ctx context.Context, id uint, user *model.User) error
	DeleteUserById(ctx context.Context, id uint) error
	ArchiveUserActivity(ctx context.Context, userId uint, activityId uint) error
	GetArchivedUserActivities(ctx context.Context, userId uint) ([]model.Activity, error)
	UnarchiveUserActivity(ctx context.Context, userId uint, activityId uint) error
	SaveUserActivitySchedule(ctx context.Context, userId uint, activityId uint) error
	GetUserActivitySchedule(ctx context.Context, userId uint) ([]model.Activity, error)
	DeleteUserActivitySchedule(ctx context.Context, userId uint, activityId uint) error
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

func (d *UserDomainImpl) GetUserById(ctx context.Context, id uint) (*model.User, error) {
	user, err := d.userRepository.GetUserById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("can't get user from UserDomain: %w", err)
	}
	return user, nil
}

func (d *UserDomainImpl) GetUsers(ctx context.Context) ([]model.User, error) {
	users, err := d.userRepository.GetUsers(ctx)
	if err != nil {
		return nil, fmt.Errorf("can't get users from UserDomain: %w", err)
	}
	return users, nil
}

func (d *UserDomainImpl) UpdateUserById(ctx context.Context, id uint, user *model.User) error {
	if err := d.userRepository.UpdateUserById(ctx, id, user); err != nil {
		return fmt.Errorf("can't update user from UserDomain: %w", err)
	}
	return nil
}

func (d *UserDomainImpl) DeleteUserById(ctx context.Context, id uint) error {
	if err := d.userRepository.DeleteUserById(ctx, id); err != nil {
		return fmt.Errorf("can't delete user from UserDomain: %w", err)
	}
	return nil
}

func (d *UserDomainImpl) ArchiveUserActivity(ctx context.Context, userId uint, activityId uint) error {
	if err := d.userRepository.ArchiveUserActivity(ctx, userId, activityId); err != nil {
		return fmt.Errorf("can't archive user activity from UserDomain: %w", err)
	}
	return nil
}

func (d *UserDomainImpl) GetArchivedUserActivities(ctx context.Context, userId uint) ([]model.Activity, error) {
	activities, err := d.userRepository.GetArchivedUserActivities(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get archived user activities from UserDomain: %w", err)
	}
	return activities, nil
}

func (d *UserDomainImpl) UnarchiveUserActivity(ctx context.Context, userId uint, activityId uint) error {
	if err := d.userRepository.UnarchiveUserActivity(ctx, userId, activityId); err != nil {
		return fmt.Errorf("can't unarchive user activity from UserDomain: %w", err)
	}
	return nil
}

func (d *UserDomainImpl) SaveUserActivitySchedule(ctx context.Context, userId uint, activityId uint) error {
	if err := d.userRepository.SaveUserActivitySchedule(ctx, userId, activityId); err != nil {
		return fmt.Errorf("can't save user activity schedule from UserDomain: %w", err)
	}
	return nil
}

func (d *UserDomainImpl) GetUserActivitySchedule(ctx context.Context, userId uint) ([]model.Activity, error) {
	activities, err := d.userRepository.GetUserActivitySchedule(ctx, userId)
	if err != nil {
		return nil, fmt.Errorf("can't get user activity schedule from UserDomain: %w", err)
	}
	return activities, nil
}

func (d *UserDomainImpl) DeleteUserActivitySchedule(ctx context.Context, userId uint, activityId uint) error {
	if err := d.userRepository.DeleteUserActivitySchedule(ctx, userId, activityId); err != nil {
		return fmt.Errorf("can't delete user activity schedule from UserDomain: %w", err)
	}
	return nil
}
