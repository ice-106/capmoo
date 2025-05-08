package handler

import (
	"fmt"
	"log/slog"
	"strconv"
	"time"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/capmoo/api/model"
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

func (h *ReviewHandler) TestUpload(c *fiber.Ctx) error {
	ctx := c.Context()

	file, err := c.FormFile("file")
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse file from TestUpload", "error", err)
		return api.BadInput(c)
	}

	contentType := file.Header.Get("Content-Type")
	if !isAllowedFileType(contentType) {
		slog.InfoContext(ctx, "File type not allowed", "fileType", contentType)
		return api.BadInput(c)
	}

	fileContent, err := file.Open()
	if err != nil {
		slog.InfoContext(ctx, "Failed to open file from TestUpload", "error", err)
		return api.InternalServerError(c)
	}
	defer fileContent.Close()

	timestamp := time.Now().Unix()
	filePath := fmt.Sprintf("uploads/%d-%s", timestamp, h.uploadService.SafeFileName(file.Filename))

	fileURL, err := h.uploadService.UploadFile(ctx, fileContent, filePath, contentType)
	if err != nil {
		slog.InfoContext(ctx, "Failed to upload file from TestUpload", "error", err)
		return api.InternalServerError(c)
	}

	return api.Ok(c, dto.UploadActivityImageResponse{
		FileUrl: fileURL,
	})
}

func isAllowedFileType(contentType string) bool {
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/png":  true,
		"image/gif":  true,
		"image/webp": true,
	}
	return allowedTypes[contentType]
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

	existedReview, err := h.reviewDomain.GetReviewByUserIdAndActivityId(ctx, userId, body.ActivityId)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewByUserIdAndActivityId", "error", err)
		return api.InternalServerError(c)
	}

	if existedReview != nil {
		slog.InfoContext(ctx, "User already has a review for this activity", "userId", userId, "activityId", body.ActivityId)
		return api.ForbiddenWithMessage(c, "You already have a review for this activity")
	}

	if err := h.reviewDomain.CreateReview(ctx, &model.Review{
		UserId:     userId,
		ActivityId: body.ActivityId,
		Rating:     body.Rating,
		Comment:    body.Comment,
		Images:     body.Images,
	}); err != nil {
		slog.InfoContext(ctx, "Unexpected error from CreateUserReview", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}

func (h *ReviewHandler) UploadReviewImages(c *fiber.Ctx) error {
	ctx := c.Context()

	form, err := c.MultipartForm()
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse multipart form", "error", err)
		return api.BadInput(c)
	}

	images := form.File["images"]
	if len(images) == 0 {
		slog.InfoContext(ctx, "No images found in multipart form")
		return api.BadInput(c)
	}

	imagePaths, err := h.uploadService.UploadMultipleFiles(ctx, images, "reviews")
	if err != nil {
		slog.InfoContext(ctx, "Failed to upload images", "error", err)
		return api.InternalServerError(c)
	}

	return api.Ok(c, imagePaths)
}

func (h *ReviewHandler) GetReviews(c *fiber.Ctx) error {
	ctx := c.Context()

	reviews, err := h.reviewDomain.GetReviews(ctx)
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

func (h *ReviewHandler) GetReviewsByActivityId(c *fiber.Ctx) error {
	ctx := c.Context()

	activityId, err := strconv.ParseUint(c.Params("activityId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse activityId from GetReviewsByActivityId", "error", err)
		return api.BadInput(c)
	}

	reviews, err := h.reviewDomain.GetReviewsByActivityId(ctx, uint(activityId))
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewsByActivityId", "error", err)
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

	reviewId, err := strconv.ParseUint(c.Params("reviewId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse reviewId from GetReviewById", "error", err)
		return api.BadInput(c)
	}

	review, err := h.reviewDomain.GetReviewById(ctx, uint(reviewId))
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

	activityId, err := strconv.ParseUint(c.Params("activityId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse activityId from GetReviewStatisticsById", "error", err)
		return api.BadInput(c)
	}

	reviewStats, err := h.reviewDomain.GetReviewStatisticsByActivityId(ctx, uint(activityId))
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewStatisticsById", "error", err)
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

	activityId, err := strconv.ParseUint(c.Params("activityId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse activityId from UpdateReview", "error", err)
		return api.BadInput(c)
	}
	reviewId, err := strconv.ParseUint(c.Params("reviewId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse reviewId from UpdateReview", "error", err)
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

	review, err := h.reviewDomain.GetReviewById(ctx, uint(reviewId))
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}
	if review.UserId != userId {
		slog.InfoContext(ctx, "UserId is not same as review.UserId", "userId", userId, "review.UserId", review.UserId)
		return api.ForbiddenWithMessage(c, "This review is not yours")
	}

	if err := h.reviewDomain.UpdateReviewById(ctx, uint(reviewId), &model.Review{
		UserId:     userId,
		ActivityId: uint(activityId),
		Rating:     body.Rating,
		Comment:    body.Comment,
	}); err != nil {
		slog.InfoContext(ctx, "Unexpected error from UpdateReview", "error", err)
		return api.InternalServerError(c)
	}

	updatedReview, err := h.reviewDomain.GetReviewById(ctx, uint(reviewId))
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

	reviewId, err := strconv.ParseUint(c.Params("reviewId"), 10, 64)
	if err != nil {
		slog.InfoContext(ctx, "Failed to parse reviewId from DeleteReview", "error", err)
		return api.BadInput(c)
	}

	review, err := h.reviewDomain.GetReviewById(ctx, uint(reviewId))
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetReviewById", "error", err)
		return api.InternalServerError(c)
	}
	if review.UserId != userId {
		slog.InfoContext(ctx, "UserId is not same as review.UserId", "userId", userId, "review.UserId", review.UserId)
		return api.ForbiddenWithMessage(c, "This review is not yours")
	}

	if err := h.reviewDomain.DeleteReviewById(ctx, uint(reviewId)); err != nil {
		slog.InfoContext(ctx, "Unexpected error from DeleteReview", "error", err)
		return api.InternalServerError(c)
	}

	return api.OkNoContent(c)
}
