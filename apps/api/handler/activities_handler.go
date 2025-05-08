package handler

import (
	"fmt"
	"log/slog"
	"strconv"
	"strings"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/capmoo/api/qid"
	"github.com/capmoo/api/upload"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type ActivityHandler struct {
	activityDomain domain.ActivityDomain
	uploadService  *upload.UploadService
	validator      *validator.Validate
	userDomain     domain.UserDomain
	reviewDomain   domain.ReviewDomain
}

func NewActivityHandler(activityDomain domain.ActivityDomain, uploadService *upload.UploadService, validator *validator.Validate, userDomain domain.UserDomain, reviewDomain domain.ReviewDomain) *ActivityHandler {
	return &ActivityHandler{
		activityDomain: activityDomain,
		uploadService:  uploadService,
		validator:      validator,
		userDomain:     userDomain,
		reviewDomain:   reviewDomain,
	}
}

func (h *ActivityHandler) GetCategories(c *fiber.Ctx) error {
	fmt.Println("GetCategories handler called")
	ctx := c.Context()

	// Fetch categories from the domain
	categories, err := h.activityDomain.GetCategories(ctx)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetCategories", "error", err)
		return api.InternalServerError(c)
	}

	// Map categories to response DTO
	response := make([]dto.GetCategoriesResponse, 0, len(categories))
	for _, category := range categories {
		response = append(response, dto.GetCategoriesResponse{
			Id:   category.Id,
			Name: category.Name,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) GetLocations(c *fiber.Ctx) error {
	fmt.Println("GetLocations handler called")
	ctx := c.Context()

	// Fetch locations from the domain
	locations, err := h.activityDomain.GetLocations(ctx)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetLocations", "error", err)
		return api.InternalServerError(c)
	}

	// Map locations to response DTO
	response := make([]dto.GetLocationsResponse, 0, len(locations))
	for _, location := range locations {
		response = append(response, dto.GetLocationsResponse{
			Id:       location.Id,
			Province: location.Province,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) GetActivityDetail(c *fiber.Ctx) error {
	fmt.Println("GetActivityDetail handler called")
	ctx := c.Context()
	idStr := c.Params("activityId")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		slog.InfoContext(ctx, "Invalid activity ID", "error", err)
		return api.InternalServerError(c)
	}

	// Fetch activity detail from the domain
	activities, err := h.activityDomain.GetActivityDetail(ctx, uint(id))
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetActivityDetail", "error", err)
		return api.InternalServerError(c)
	}

	// Check if activity exists
	if len(activities) == 0 {
		slog.InfoContext(ctx, "Activity not found", "id", id)
		return api.NotFound(c)
	}

	// Map activity detail to response DTO
	response := make([]dto.GetActivityDetailResponse, 0, len(activities))
	for _, activity := range activities {
		response = append(response, dto.GetActivityDetailResponse{
			Id:            activity.Id,
			Name:          activity.Name,
			Description:   activity.Description,
			Price:         activity.Price,
			StartDateTime: activity.StartDateTime,
			Location:      activity.Location.Province,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) GetFilteredActivities(c *fiber.Ctx) error {
	fmt.Println("GetFilteredActivities handler called")
	ctx := c.Context()

	fmt.Println("Hello")
	// Parse query parameters
	searchTerm := c.Query("q", "")
	locations := c.Query("location", "")
	minPrice := c.Query("minPrice", "")
	maxPrice := c.Query("maxPrice", "")
	categories := c.Query("category", "")

	// Convert query parameters to appropriate types
	var minPriceFloat, maxPriceFloat *float64
	if minPrice != "" {
		price, err := strconv.ParseFloat(minPrice, 64)
		if err == nil {
			minPriceFloat = &price
		}
	}
	if maxPrice != "" {
		price, err := strconv.ParseFloat(maxPrice, 64)
		if err == nil {
			maxPriceFloat = &price
		}
	}

	// Split locations and categories into slices
	locationList := []uint{}
	for _, loc := range strings.Split(locations, ",") {
		if loc != "" {
			id, err := strconv.ParseUint(loc, 10, 32)
			if err == nil {
				locationList = append(locationList, uint(id))
			}
		}
	}

	categoryList := []uint{}
	for _, cat := range strings.Split(categories, ",") {
		if cat != "" {
			id, err := strconv.ParseUint(cat, 10, 32)
			if err == nil {
				categoryList = append(categoryList, uint(id))
			}
		}
	}

	// Fetch activities from the domain
	activities, err := h.activityDomain.GetActivitiesByFilters(ctx, searchTerm, locationList, minPriceFloat, maxPriceFloat, categoryList)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetActivitiesByFilters", "error", err)
		return api.InternalServerError(c)
	}

	// Map activities to response DTO
	response := make([]dto.GetActivitiesResponse, 0, len(activities))
	for _, activity := range activities {
		response = append(response, dto.GetActivitiesResponse{
			Id:         activity.Id,
			Name:       activity.Name,
			CategoryId: activity.CategoryId,
			LocationId: activity.LocationId,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) ArchiveUserActivityById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from ArchiveUserActivity", "error", err)
		return api.BadInput(c)
	}

	if err := h.userDomain.ArchiveUserActivity(ctx, userId, params.ActivityId.Uint()); err != nil {
		slog.InfoContext(ctx, "Unexpected error from ArchiveUserActivity", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ActivityHandler) GetArchivedUserActivities(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	activities, err := h.userDomain.GetArchivedUserActivities(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetArchivedUserActivities", "error", err)
		return api.InternalServerError(c)
	}

	response := make([]dto.GetActivitiesResponse, 0, len(activities))
	for _, activity := range activities {
		response = append(response, dto.GetActivitiesResponse{
			Id:         activity.Id,
			Name:       activity.Name,
			CategoryId: activity.CategoryId,
			LocationId: activity.LocationId,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) UnarchiveUserActivityById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from UnarchiveUserActivity", "error", err)
		return api.BadInput(c)
	}

	if err := h.userDomain.UnarchiveUserActivity(ctx, userId, params.ActivityId.Uint()); err != nil {
		slog.InfoContext(ctx, "Unexpected error from UnarchiveUserActivity", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ActivityHandler) SaveUserActivityScheduleById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from SaveUserActivitySchedule", "error", err)
		return api.BadInput(c)
	}

	if err := h.userDomain.SaveUserActivitySchedule(ctx, userId, params.ActivityId.Uint()); err != nil {
		slog.InfoContext(ctx, "Unexpected error from SaveUserActivitySchedule", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ActivityHandler) GetUserActivitySchedule(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	activities, err := h.userDomain.GetUserActivitySchedule(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserActivitySchedule", "error", err)
		return api.InternalServerError(c)
	}

	response := make([]dto.GetActivitiesResponse, 0, len(activities))
	for _, activity := range activities {
		response = append(response, dto.GetActivitiesResponse{
			Id:         activity.Id,
			Name:       activity.Name,
			CategoryId: activity.CategoryId,
			LocationId: activity.LocationId,
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) DeleteUserActivityScheduleById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from DeleteUserActivitySchedule", "error", err)
		return api.BadInput(c)
	}

	if err := h.userDomain.DeleteUserActivitySchedule(ctx, userId, params.ActivityId.Uint()); err != nil {
		slog.InfoContext(ctx, "Unexpected error from DeleteUserActivitySchedule", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}
