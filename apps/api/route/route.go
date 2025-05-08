package route

import (
	"github.com/capmoo/api/handler"
	"github.com/capmoo/api/middleware"
	"github.com/gofiber/fiber/v2"
)

type V1Handler struct {
	authMiddleware  *middleware.AuthMiddleware
	userHandler     *handler.UserHandler
	surveyHandler   *handler.SurveyHandler
	activityHandler *handler.ActivityHandler
	reviewHandler   *handler.ReviewHandler
}

func V1NewHandler(
	authMiddleware *middleware.AuthMiddleware,
	userHandler *handler.UserHandler,
	surveyHandler *handler.SurveyHandler,
	activityHandler *handler.ActivityHandler,
	reviewHandler *handler.ReviewHandler,
) *V1Handler {
	return &V1Handler{
		authMiddleware:  authMiddleware,
		userHandler:     userHandler,
		surveyHandler:   surveyHandler,
		activityHandler: activityHandler,
		reviewHandler:   reviewHandler,
	}
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	v1Router := r.Group("/v1")

	guardRouter := v1Router.Use(v1.authMiddleware.Handler)
	v1.RegisterUserRouter(guardRouter)
	v1.RegisterSurveyRouter(guardRouter)
	v1.RegisterActivityRouter(guardRouter)
	v1.RegisterReviewRouter(guardRouter)
}

func (v1 *V1Handler) RegisterUserRouter(r fiber.Router) {
	userRouter := r.Group("/user")

	userRouter.Get("/me", v1.userHandler.Me)
	userRouter.Patch("/me", v1.userHandler.UpdateUserById)

	userRouter.Get("/reviews", v1.userHandler.GetUserReviews)
}

func (v1 *V1Handler) RegisterSurveyRouter(r fiber.Router) {
	surveyRouter := r.Group("/survey")

	surveyRouter.Post("/preferences", v1.surveyHandler.CreateUserPreferences)
	surveyRouter.Get("/preferences", v1.surveyHandler.GetUserPreferences)
	surveyRouter.Post("/concerns", v1.surveyHandler.CreateUserConcerns)
	surveyRouter.Get("/concerns", v1.surveyHandler.GetUserConcerns)
	surveyRouter.Post("/travel-types", v1.surveyHandler.CreateUserTravelTypes)
	surveyRouter.Get("/travel-types", v1.surveyHandler.GetUserTravelTypes)
}

func (v1 *V1Handler) RegisterActivityRouter(r fiber.Router) {
	activityRouter := r.Group("/activities")

	activityRouter.Get("/search", v1.activityHandler.GetFilteredActivities)
	activityRouter.Get("/locations", v1.activityHandler.GetLocations)
	activityRouter.Get("/categories", v1.activityHandler.GetCategories)

	activityRouter.Post("/archive/:activityId", v1.activityHandler.ArchiveUserActivityById)
	activityRouter.Get("/archive", v1.activityHandler.GetArchivedUserActivities)
	activityRouter.Delete("/archive/:activityId", v1.activityHandler.UnarchiveUserActivityById)

	activityRouter.Post("/schedule/:activityId", v1.activityHandler.SaveUserActivityScheduleById)
	activityRouter.Get("/schedule", v1.activityHandler.GetUserActivitySchedule)
	activityRouter.Delete("/schedule/:activityId", v1.activityHandler.DeleteUserActivityScheduleById)

	activityRouter.Get("/:activityId", v1.activityHandler.GetActivityDetail)
	activityRouter.Post("/:activityId/reviews", v1.reviewHandler.CreateUserReview)
	activityRouter.Post("/:activityId/reviews/upload", v1.reviewHandler.UploadReviewImages)
	activityRouter.Get("/:activityId/reviews", v1.reviewHandler.GetReviewsByActivityId)
	activityRouter.Get("/:activityId/reviews/:reviewId", v1.reviewHandler.GetReviewById)
	activityRouter.Get("/:activityId/reviews/:reviewId/stats", v1.reviewHandler.GetReviewStatisticsById)
	activityRouter.Patch("/:activityId/reviews/:reviewId", v1.reviewHandler.UpdateUserReviewById)
	activityRouter.Delete("/:activityId/reviews/:reviewId", v1.reviewHandler.DeleteUserReviewById)
}

func (v1 *V1Handler) RegisterReviewRouter(r fiber.Router) {
	reviewRouter := r.Group("/reviews")

	reviewRouter.Get("/", v1.reviewHandler.GetReviews)
}
