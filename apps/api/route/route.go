package route

import (
	"github.com/capmoo/api/handler"
	"github.com/capmoo/api/middleware"
	"github.com/gofiber/fiber/v2"
)

type V1Handler struct {
	authMiddleware *middleware.AuthMiddleware
	userHandler    *handler.UserHandler
	surveyHandler  *handler.SurveyHandler
}

func V1NewHandler(
	authMiddleware *middleware.AuthMiddleware,
	userHandler *handler.UserHandler,
	surveyHandler *handler.SurveyHandler,
) *V1Handler {
	return &V1Handler{
		authMiddleware: authMiddleware,
		userHandler:    userHandler,
		surveyHandler:  surveyHandler,
	}
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	v1Router := r.Group("/v1")

	guardRouter := v1Router.Use(v1.authMiddleware.Handler)
	v1.RegisterUserRouter(guardRouter)
	v1.RegisterSurveyRouter(guardRouter)
}

func (v1 *V1Handler) RegisterUserRouter(r fiber.Router) {
	userRouter := r.Group("/user")

	userRouter.Get("/me", v1.userHandler.Me)
	userRouter.Patch("/me", v1.userHandler.UpdateUserById)

	userRouter.Post("/reviews", v1.userHandler.CreateUserReview) // TODO: move to activity, create review from activity router
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
