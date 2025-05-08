package handler

import (
	"log/slog"
	"time"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/capmoo/api/model"
	"github.com/capmoo/api/qid"
	"github.com/capmoo/api/upload"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type ReviewHandler struct {
	reviewDomain  domain.ReviewDomain
	uploadService *upload.UploadService
	validator     *validator.Validate
}

func NewReviewHandler(
	reviewDomain domain.ReviewDomain,
	uploadService *upload.UploadService,
	validator *validator.Validate,
) *ReviewHandler {
	return &ReviewHandler{
		reviewDomain:  reviewDomain,
		uploadService: uploadService,
		validator:     validator,
	}
}

func (h *ReviewHandler) CreateUserReview(c *fiber.Ctx) error {
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

	form, err := c.MultipartForm()
	if err != nil {
		slog.Info("Failed to read multipart form", "error", err)
		return api.BadInput(c)
	}

	files := form.File["images"]
	var imagePaths []string
	if len(files) > 0 {
		imagePaths, err = h.uploadService.UploadMultipleFiles(c.Context(), files, "review")
		if err != nil {
			slog.Info("Failed to upload images", "error", err)
			return api.InternalServerError(c)
		}
	}

	if err := h.reviewDomain.CreateReview(ctx, &model.Review{
		UserId:     userId,
		ActivityId: body.ActivityId,
		Rating:     body.Rating,
		Comment:    body.Comment,
		Images:     imagePaths,
	}); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserReview", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ReviewHandler) GetReviewsByActivityId(c *fiber.Ctx) error {
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
		presignedUrls := make([]string, 0, len(review.Images))
		for _, image := range review.Images {
			presignedUrl, err := h.uploadService.GetPresignedURL(ctx, image, 60*time.Minute)
			if err != nil {
				slog.InfoContext(ctx, "Failed to get presigned URL", "error", err)
				return api.InternalServerError(c)
			}
			presignedUrls = append(presignedUrls, presignedUrl)
		}

		response = append(response, dto.GetUserReviewsResponse{
			Id:        review.Id,
			CreatedAt: review.CreatedAt,
			UpdatedAt: review.UpdatedAt,
			Rating:    review.Rating,
			Comment:   review.Comment,
			Images:    presignedUrls,
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

func (h *ReviewHandler) GetReviewById(c *fiber.Ctx) error {
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

	presignedUrls := make([]string, 0, len(review.Images))
	for _, image := range review.Images {
		presignedUrl, err := h.uploadService.GetPresignedURL(ctx, image, 60*time.Minute)
		if err != nil {
			slog.InfoContext(ctx, "Failed to get presigned URL", "error", err)
			return api.InternalServerError(c)
		}
		presignedUrls = append(presignedUrls, presignedUrl)
	}

	response := dto.GetUserReviewsResponse{
		Id:        review.Id,
		CreatedAt: review.CreatedAt,
		UpdatedAt: review.UpdatedAt,
		Rating:    review.Rating,
		Comment:   review.Comment,
		Images:    presignedUrls,
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

func (h *ReviewHandler) GetReviewStatisticsById(c *fiber.Ctx) error {
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

func (h *ReviewHandler) UpdateUserReviewById(c *fiber.Ctx) error {
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

	presignedUrls := make([]string, 0, len(updatedReview.Images))
	for _, image := range updatedReview.Images {
		presignedUrl, err := h.uploadService.GetPresignedURL(ctx, image, 60*time.Minute)
		if err != nil {
			slog.InfoContext(ctx, "Failed to get presigned URL", "error", err)
			return api.InternalServerError(c)
		}
		presignedUrls = append(presignedUrls, presignedUrl)
	}

	response := dto.UpdateUserReviewResponse{
		Id:        updatedReview.Id,
		CreatedAt: updatedReview.CreatedAt,
		UpdatedAt: updatedReview.UpdatedAt,
		Rating:    updatedReview.Rating,
		Comment:   updatedReview.Comment,
		Images:    presignedUrls,
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

func (h *ReviewHandler) DeleteUserReviewById(c *fiber.Ctx) error {
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
