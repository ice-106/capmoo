package route

import (
	"github.com/capmoo/api/handler"
	"github.com/capmoo/api/middleware"
	"github.com/gofiber/fiber/v2"
)

type V1Handler struct {
	authMiddleware  *middleware.AuthMiddleware
	userHandler     *handler.UserHandler
	activityHandler *handler.ActivityHandler
}

func V1NewHandler(
	authMiddleware *middleware.AuthMiddleware,
	userHandler *handler.UserHandler,
	activityHandler *handler.ActivityHandler,
) *V1Handler {
	return &V1Handler{
		authMiddleware:  authMiddleware,
		userHandler:     userHandler,
		activityHandler: activityHandler,
	}
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	v1Router := r.Group("/v1")

	guardRouter := v1Router.Use(v1.authMiddleware.Handler)
	v1.RegisterUserRouter(guardRouter)
}

func (v1 *V1Handler) RegisterUserRouter(r fiber.Router) {
	userRouter := r.Group("/user")

	userRouter.Get("/", v1.userHandler.GetUsers)
}

func (v1 *V1Handler) RegisterActivityRouter(r fiber.Router) {
	activityRouter := r.Group("/activities")

	activityRouter.Get("/", v1.activityHandler.GetFilteredActivities)
}
