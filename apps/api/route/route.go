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

	userRouter.Get("/", v1.userHandler.GetUsers)
}

func (v1 *V1Handler) RegisterSurveyRouter(r fiber.Router) {
	surveyRouter := r.Group("/survey")

	surveyRouter.Post("/preference", v1.surveyHandler.CreateUserPreference)
	surveyRouter.Get("/preference", v1.surveyHandler.GetUserPreference)
}
