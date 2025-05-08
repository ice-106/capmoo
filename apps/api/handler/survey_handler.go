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

func (h *SurveyHandler) CreateUserPreferences(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	body := new(dto.CreateUserPreferencesRequest)
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

func (h *SurveyHandler) GetUserPreferences(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	preferences, err := h.surveyDomain.GetUserPreferences(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserPreference", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserPreferencesResponse{
		Preferences: preferences,
	}

	return api.Ok(c, response)
}

func (h *SurveyHandler) CreateUserConcerns(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	body := new(dto.CreateUserConcernsRequest)
	if err := c.BodyParser(body); err != nil {
		slog.InfoContext(ctx, "Failed to parse body from CreateUserConcerns", "error", err)
		return api.BadInput(c)
	}

	if err := h.validator.Struct(body); err != nil {
		slog.WarnContext(ctx, "Failed to parse body from CreateUserConcerns", "error", err)
		return api.BadInput(c)
	}

	if err := h.surveyDomain.CreateUserConcerns(ctx, userId, body.Concerns); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserConcerns", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *SurveyHandler) GetUserConcerns(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	concerns, err := h.surveyDomain.GetUserConcerns(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserConcerns", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserConcernsResponse{
		Concerns: concerns,
	}

	return api.Ok(c, response)
}

func (h *SurveyHandler) CreateUserTravelTypes(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	body := new(dto.CreateUserTravelTypesRequest)
	if err := c.BodyParser(body); err != nil {
		slog.InfoContext(ctx, "Failed to parse body from CreateUserTravelTypes", "error", err)
		return api.BadInput(c)
	}

	if err := h.validator.Struct(body); err != nil {
		slog.WarnContext(ctx, "Failed to parse body from CreateUserTravelTypes", "error", err)
		return api.BadInput(c)
	}

	if err := h.surveyDomain.CreateUserTravelTypes(ctx, userId, body.TravelTypes); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserTravelTypes", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *SurveyHandler) GetUserTravelTypes(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	travelTypes, err := h.surveyDomain.GetUserTravelTypes(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserTravelTypes", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserTravelTypesResponse{
		TravelTypes: travelTypes,
	}

	return api.Ok(c, response)
}
