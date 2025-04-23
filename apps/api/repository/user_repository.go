package repository

import (
	"context"

	"github.com/capmoo/api/model"
	"gorm.io/gorm"
)

type UserRepository interface {
	CreateUser(ctx context.Context, user *model.User) error
	GetUserById(ctx context.Context, id string) (*model.User, error)
	GetUsers(ctx context.Context) ([]model.User, error)
	UpdateUserById(ctx context.Context, id string, user *model.User) error
	DeleteUserById(ctx context.Context, id string) error
	ArchiveActivity(ctx context.Context, userId uint, activityId uint) error
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

func (r *UserRepositoryImpl) GetUserById(ctx context.Context, id string) (*model.User, error) {
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

func (r *UserRepositoryImpl) UpdateUserById(ctx context.Context, id string, user *model.User) error {
	if err := r.db.WithContext(ctx).Model(&model.User{}).Where("id = ?", id).Updates(user).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepositoryImpl) DeleteUserById(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.User{}).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepositoryImpl) ArchiveActivity(ctx context.Context, userId uint, activityId uint) error {
	return r.db.WithContext(ctx).Create(&model.UserActivity{
		UserId:     userId,
		ActivityId: activityId,
	}).Error
}
