package handler

import (
	"log/slog"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type SurveyHandler struct {
	surveyDomain domain.SurveyDomain
	validator    *validator.Validate
}

func NewSurveyHandler(surveyDomain domain.SurveyDomain, validator *validator.Validate) *SurveyHandler {
	return &SurveyHandler{
		surveyDomain: surveyDomain,
		validator:    validator,
	}
}

func (h *SurveyHandler) CreateUserPreference(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	body := new(dto.CreateUserPreferenceRequest)
	if err := c.BodyParser(body); err != nil {
		slog.InfoContext(ctx, "Failed to parse body from CreateUserPreference", "error", err)
		return api.BadInput(c)
	}

	if err := h.validator.Struct(body); err != nil {
		slog.WarnContext(ctx, "Failed to parse body from CreateUserPreference", "error", err)
		return api.BadInput(c)
	}

	if err := h.surveyDomain.CreateUserPreferences(ctx, userId, body.Preferences); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserPreference", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *SurveyHandler) GetUserPreference(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	preferences, err := h.surveyDomain.GetUserPreferences(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserPreference", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserPreferenceResponse{
		Preferences: preferences,
	}

	return api.Ok(c, response)
}
