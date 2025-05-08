package handler

import (
	"log/slog"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/capmoo/api/model"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userDomain   domain.UserDomain
	validator    *validator.Validate
	reviewDomain domain.ReviewDomain
}

func NewUserHandler(userDomain domain.UserDomain, validator *validator.Validate, reviewDomain domain.ReviewDomain) *UserHandler {
	return &UserHandler{
		userDomain:   userDomain,
		validator:    validator,
		reviewDomain: reviewDomain,
	}
}

func (h *UserHandler) Me(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	users, err := h.userDomain.GetUserById(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from Me", "error", err)
		return api.InternalServerError(c)
	}

	response := dto.GetUserResponse{
		Id:        users.Id,
		CreatedAt: users.CreatedAt,
		UpdatedAt: users.UpdatedAt,
		Name:      users.Name,
		Email:     users.Email,
		OidcId:    users.OidcId.String(),
	}

	return api.Ok(c, response)
}

func (h *UserHandler) CreateUserReview(c *fiber.Ctx) error {
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

func (h *UserHandler) GetUserReviews(c *fiber.Ctx) error {
	ctx := c.Context()
	userId := api.MustGetUserIDFromContext(c)

	reviews, err := h.reviewDomain.GetReviewsByUserId(ctx, userId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetUserReviews", "error", err)
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
			// Activity: dto.GetActivityResponse{
			// 	Id:               review.Activity.Id,
			// 	CreatedAt:        review.Activity.CreatedAt,
			// 	UpdatedAt:        review.Activity.UpdatedAt,
			// 	Name:             review.Activity.Name,
			// 	Description:      review.Activity.Description,
			// 	StartDateTime:    review.Activity.StartDateTime,
			// 	EndDateTime:      review.Activity.EndDateTime,
			// 	Price:            review.Activity.Price,
			// 	RemainSlot:       review.Activity.RemainSlot,
			// 	MaxParticipation: review.Activity.MaxParticipation,
			// }, // TODO: add activity response struct
		})
	}

	return api.Ok(c, response)
}
