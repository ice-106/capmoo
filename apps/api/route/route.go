package route

import (
	"github.com/capmoo/api/handler"
	"github.com/gofiber/fiber/v2"
	// middlewares "github.com/capmoo/api/internal/middleware"
)

func V1NewHandler(
	userHandler *handler.UserHandler,
) *V1Handler {
	return &V1Handler{
		userHandler: userHandler,
	}
}

type V1Handler struct {
	userHandler *handler.UserHandler
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	v1Router := r.Group("/v1")

	v1.RegisterUserRouter(v1Router)
}

func (v1 *V1Handler) RegisterUserRouter(r fiber.Router) {
	userRouter := r.Group("/user")

	userRouter.Get("/", v1.userHandler.GetUsers)
}
