package handler

import (
	"log/slog"

	"strconv"

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
			OidcId:    user.OidcId.String(),
		})
	}

	return api.Ok(c, response)
}

func (h *UserHandler) ArchiveActivity(c *fiber.Ctx) error {
	userId, err := strconv.Atoi(c.Params("id"))
	activityId, err2 := strconv.Atoi(c.Params("activityId"))
	if err != nil || err2 != nil {
		return api.BadInput(c)
	}

	err = h.userDomain.ArchiveActivity(c.Context(), uint(userId), uint(activityId))
	if err != nil {
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}
