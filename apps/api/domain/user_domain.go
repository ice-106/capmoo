package domain

import "github.com/capmoo/api/repository"

type UserDomain interface {
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
