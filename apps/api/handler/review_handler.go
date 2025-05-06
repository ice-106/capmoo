package handler

import (
	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/model"
	"github.com/gofiber/fiber/v2"
)

type ReviewHandler struct {
	reviewDomain domain.ReviewDomain
}

func NewReviewHandler(reviewDomain domain.ReviewDomain) *ReviewHandler {
	return &ReviewHandler{
		reviewDomain: reviewDomain,
	}
}

func (h *ReviewHandler) CreateReview(c *fiber.Ctx) error {
	var review model.Review
	if err := c.BodyParser(&review); err != nil {
		return api.BadInputWithMessage(c, "INVALID_JSON", "Cannot parse request body")
	}

	if review.Rating < 1 || review.Rating > 5 {
		return api.BadInputWithMessage(c, "INVALID_RATING", "Rating must be between 1 and 5")
	}

	if err := h.reviewDomain.CreateReview(c.Context(), &review); err != nil {
		return api.InternalServerError(c)
	}

	return api.Ok(c, fiber.Map{
		"message": "Review created successfully",
	})
}
