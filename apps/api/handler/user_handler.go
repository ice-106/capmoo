package handler

import (
	"log/slog"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userDomain domain.UserDomain
}

func NewUserHandler(userDomain domain.UserDomain) *UserHandler {
	return &UserHandler{
		userDomain: userDomain,
	}
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	ctx := c.Context()

	users, err := h.userDomain.GetUsers(ctx)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUsers", "error", err)
		return api.InternalServerError(c)
	}

	response := make([]dto.GetUsersResponse, 0, len(users))
	for _, user := range users {
		response = append(response, dto.GetUsersResponse{
			Id:        user.Id,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
			Name:      user.Name,
			OidcId:    user.OidcId.String(),
			Email:     user.Email,
		})
	}

	return api.Ok(c, response)
}
