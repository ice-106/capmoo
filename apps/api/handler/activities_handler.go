package handler

import (
	"fmt"
	"log/slog"
	"strconv"
	"strings"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/capmoo/api/model"
	"github.com/capmoo/api/qid"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type ActivityHandler struct {
	activityDomain domain.ActivityDomain
	validator      *validator.Validate
	reviewDomain   domain.ReviewDomain
}

func NewActivityHandler(activityDomain domain.ActivityDomain, validator *validator.Validate, reviewDomain domain.ReviewDomain) *ActivityHandler {
	return &ActivityHandler{
		activityDomain: activityDomain,
		validator:      validator,
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

func (h *ActivityHandler) CreateUserReview(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	body := new(dto.CreateUserReviewRequest)
	if err := c.BodyParser(body); err != nil {
		slog.InfoContext(ctx, "Failed to parse body from CreateUserReview", "error", err)
		return api.BadInput(c)
	}

	if err := h.validator.Struct(body); err != nil {
		slog.WarnContext(ctx, "Failed to parse body from CreateUserReview", "error", err)
		return api.BadInput(c)
	}

	if err := h.reviewDomain.CreateReview(ctx, &model.Review{
		UserId:     userId,
		ActivityId: body.ActivityId,
		Rating:     body.Rating,
		Comment:    body.Comment,
	}); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserReview", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ActivityHandler) GetReviews(c *fiber.Ctx) error {
	ctx := c.Context()

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from GetReviews", "error", err)
		return api.BadInput(c)
	}

	reviews, err := h.reviewDomain.GetReviewsByActivityId(ctx, params.ActivityId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviews", "error", err)
		return api.InternalServerError(c)
	}

	response := make([]dto.GetUserReviewsResponse, 0, len(reviews))
	for _, review := range reviews {
		response = append(response, dto.GetUserReviewsResponse{
			Id:        review.Id,
			CreatedAt: review.CreatedAt,
			UpdatedAt: review.UpdatedAt,
			Rating:    review.Rating,
			Comment:   review.Comment,
			UserId:    review.UserId,
			User: dto.GetUserResponse{
				Id:        review.User.Id,
				CreatedAt: review.User.CreatedAt,
				UpdatedAt: review.User.UpdatedAt,
				Name:      review.User.Name,
				Email:     review.User.Email,
				OidcId:    review.User.OidcId.String(),
			},
			ActivityId: review.ActivityId,
			Activity: dto.GetActivityResponse{
				Id:               review.Activity.Id,
				CreatedAt:        review.Activity.CreatedAt,
				UpdatedAt:        review.Activity.UpdatedAt,
				Name:             review.Activity.Name,
				Description:      review.Activity.Description,
				StartDateTime:    review.Activity.StartDateTime,
				EndDateTime:      review.Activity.EndDateTime,
				Price:            review.Activity.Price,
				RemainSlot:       review.Activity.RemainSlot,
				MaxParticipation: review.Activity.MaxParticipation,
			},
		})
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) GetReviewById(c *fiber.Ctx) error {
	ctx := c.Context()

	var params struct {
		ActivityId qid.QID `params:"id"`
		ReviewId   qid.QID `params:"reviewId"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from GetUserReview", "error", err)
		return api.BadInput(c)
	}

	review, err := h.reviewDomain.GetReviewById(ctx, params.ReviewId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserReviewsResponse{
		Id:        review.Id,
		CreatedAt: review.CreatedAt,
		UpdatedAt: review.UpdatedAt,
		Rating:    review.Rating,
		Comment:   review.Comment,
		UserId:    review.UserId,
		User: dto.GetUserResponse{
			Id:        review.User.Id,
			CreatedAt: review.User.CreatedAt,
			UpdatedAt: review.User.UpdatedAt,
			Name:      review.User.Name,
			Email:     review.User.Email,
			OidcId:    review.User.OidcId.String(),
		},
		ActivityId: review.ActivityId,
		Activity: dto.GetActivityResponse{
			Id:               review.Activity.Id,
			CreatedAt:        review.Activity.CreatedAt,
			UpdatedAt:        review.Activity.UpdatedAt,
			Name:             review.Activity.Name,
			Description:      review.Activity.Description,
			StartDateTime:    review.Activity.StartDateTime,
			EndDateTime:      review.Activity.EndDateTime,
			Price:            review.Activity.Price,
			RemainSlot:       review.Activity.RemainSlot,
			MaxParticipation: review.Activity.MaxParticipation,
		},
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) GetReviewStatisticsById(c *fiber.Ctx) error {
	ctx := c.Context()

	var params struct {
		ActivityId qid.QID `params:"id"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from GetReviewStatistics", "error", err)
		return api.BadInput(c)
	}

	reviewStats, err := h.reviewDomain.GetReviewStatisticsByActivityId(ctx, params.ActivityId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewStatistics", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetReviewStatisticsResponse{
		AverageRating: reviewStats.AverageRating,
		TotalReviews:  reviewStats.TotalReviews,
		RatingCount:   reviewStats.RatingCount,
		RatingSum:     reviewStats.RatingSum,
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) UpdateUserReviewById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
		ReviewId   qid.QID `params:"reviewId"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from UpdateReview", "error", err)
		return api.BadInput(c)
	}

	body := new(dto.UpdateUserReviewRequest)
	if err := c.BodyParser(body); err != nil {
		slog.InfoContext(ctx, "Failed to parse body from UpdateReview", "error", err)
		return api.BadInput(c)
	}

	if err := h.validator.Struct(body); err != nil {
		slog.WarnContext(ctx, "Failed to parse body from UpdateReview", "error", err)
		return api.BadInput(c)
	}

	review, err := h.reviewDomain.GetReviewById(ctx, params.ReviewId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}
	if review.UserId != userId {
		slog.InfoContext(ctx, "UserId is not same as review.UserId", "userId", userId, "review.UserId", review.UserId)
		return api.ForbiddenWithMessage(c, "This review is not yours")
	}

	if err := h.reviewDomain.UpdateReviewById(ctx, params.ReviewId.Uint(), &model.Review{
		UserId:     userId,
		ActivityId: params.ActivityId.Uint(),
		Rating:     body.Rating,
		Comment:    body.Comment,
	}); err != nil {
		slog.InfoContext(ctx, "Unexpected error from UpdateReview", "error", err)
		return api.InternalServerError(c)
	}

	updatedReview, err := h.reviewDomain.GetReviewById(ctx, params.ReviewId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.UpdateUserReviewResponse{
		Id:        updatedReview.Id,
		CreatedAt: updatedReview.CreatedAt,
		UpdatedAt: updatedReview.UpdatedAt,
		Rating:    updatedReview.Rating,
		Comment:   updatedReview.Comment,
		UserId:    review.UserId,
		User: dto.GetUserResponse{
			Id:        review.User.Id,
			CreatedAt: review.User.CreatedAt,
			UpdatedAt: review.User.UpdatedAt,
			Name:      review.User.Name,
			Email:     review.User.Email,
			OidcId:    review.User.OidcId.String(),
		},
		ActivityId: review.ActivityId,
		Activity: dto.GetActivityResponse{
			Id:               review.Activity.Id,
			CreatedAt:        review.Activity.CreatedAt,
			UpdatedAt:        review.Activity.UpdatedAt,
			Name:             review.Activity.Name,
			Description:      review.Activity.Description,
			StartDateTime:    review.Activity.StartDateTime,
			EndDateTime:      review.Activity.EndDateTime,
			Price:            review.Activity.Price,
			RemainSlot:       review.Activity.RemainSlot,
			MaxParticipation: review.Activity.MaxParticipation,
		},
	}

	return api.Ok(c, response)
}

func (h *ActivityHandler) DeleteUserReviewById(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	var params struct {
		ActivityId qid.QID `params:"id"`
		ReviewId   qid.QID `params:"reviewId"`
	}

	if err := c.ParamsParser(&params); err != nil {
		slog.InfoContext(ctx, "Failed to parse params from DeleteReview", "error", err)
		return api.BadInput(c)
	}

	review, err := h.reviewDomain.GetReviewById(ctx, params.ReviewId.Uint())
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}
	if review.UserId != userId {
		slog.InfoContext(ctx, "UserId is not same as review.UserId", "userId", userId, "review.UserId", review.UserId)
		return api.ForbiddenWithMessage(c, "This review is not yours")
	}

	if err := h.reviewDomain.DeleteReviewById(ctx, params.ReviewId.Uint()); err != nil {
		slog.InfoContext(ctx, "Unexpected error from DeleteReview", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}
