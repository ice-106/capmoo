package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *model.User) error
	CreateIfNotExists(ctx context.Context, user *model.User) (*model.User, error)
	GetUserById(ctx context.Context, id uint) (*model.User, error)
	GetUsers(ctx context.Context) ([]model.User, error)
	UpdateUserById(ctx context.Context, id uint, user *model.User) error
	DeleteUserById(ctx context.Context, id uint) error
	ArchiveUserActivity(ctx context.Context, userId uint, activityId uint) error
	GetArchivedUserActivities(ctx context.Context, userId uint) ([]model.Activity, error)
	UnarchiveUserActivity(ctx context.Context, userId uint, activityId uint) error
}

type UserRepositoryImpl struct {
	db *gorm.DB
}

var _ UserRepository = &UserRepositoryImpl{}

func NewUserRepository(db *gorm.DB) *UserRepositoryImpl {
	return &UserRepositoryImpl{
		db: db,
	}
}

func (r *UserRepositoryImpl) CreateUser(ctx context.Context, user *model.User) error {
	if err := r.db.WithContext(ctx).Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepositoryImpl) CreateIfNotExists(ctx context.Context, user *model.User) (*model.User, error) {
	if err := r.db.WithContext(ctx).Where("oidc_id = ?", user.OidcId).FirstOrCreate(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepositoryImpl) GetUserById(ctx context.Context, id uint) (*model.User, error) {
	var user model.User
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepositoryImpl) GetUsers(ctx context.Context) ([]model.User, error) {
	var users []model.User
	if err := r.db.WithContext(ctx).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepositoryImpl) UpdateUserById(ctx context.Context, id uint, user *model.User) error {
	if err := r.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepositoryImpl) DeleteUserById(ctx context.Context, id uint) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepositoryImpl) ArchiveUserActivity(ctx context.Context, userId uint, activityId uint) error {
	var user model.User
	if err := r.db.WithContext(ctx).First(&user, userId).Error; err != nil {
		return err
	}

	var activity model.Activity
	if err := r.db.WithContext(ctx).First(&activity, activityId).Error; err != nil {
		return err
	}

	if err := r.db.WithContext(ctx).Model(&user).Association("ActivitiesArchives").Append(&activity); err != nil {
		return err
	}

	return nil
}

func (r *UserRepositoryImpl) GetArchivedUserActivities(ctx context.Context, userId uint) ([]model.Activity, error) {
	var user model.User
	if err := r.db.WithContext(ctx).Preload("ActivitiesArchives").First(&user, userId).Error; err != nil {
		return nil, err
	}

	return user.ActivitiesArchives, nil
}

func (r *UserRepositoryImpl) UnarchiveUserActivity(ctx context.Context, userId uint, activityId uint) error {
	var user model.User
	if err := r.db.WithContext(ctx).First(&user, userId).Error; err != nil {
		return err
	}

	var activity model.Activity
	if err := r.db.WithContext(ctx).First(&activity, activityId).Error; err != nil {
		return err
	}

	if err := r.db.WithContext(ctx).Model(&user).Association("ActivitiesArchives").Delete(&activity); err != nil {
		return err
	}

	return nil
}
