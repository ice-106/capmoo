package handler

import (
	"github.com/capmoo/api/domain"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userDomain *domain.UserDomain
}

func NewUserHandler(userDomain *domain.UserDomain) *UserHandler {
	return &UserHandler{
		userDomain: userDomain,
	}
}

func (userHandler *UserHandler) GetUser(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "Get user",
	})
}
