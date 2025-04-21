package repository

import "gorm.io/gorm"

type UserRepository interface {
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
