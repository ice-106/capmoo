package route

import (
	"github.com/capmoo/api/handler"
	"github.com/gofiber/fiber/v2"
	// middlewares "github.com/capmoo/api/internal/middleware"
)

func V1NewHandler(
	userHandler *handler.UserHandler,
	reviewHandler *handler.ReviewHandler,
) *V1Handler {
	return &V1Handler{
		userHandler:   userHandler,
		reviewHandler: reviewHandler,
	}
}

type V1Handler struct {
	userHandler   *handler.UserHandler
	reviewHandler *handler.ReviewHandler
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	v1Router := r.Group("/v1")

	v1.RegisterUserRouter(v1Router)
	v1.RegisterReviewRouter(v1Router)
}

func (v1 *V1Handler) RegisterUserRouter(r fiber.Router) {
	userRouter := r.Group("/user")

	userRouter.Get("/", v1.userHandler.GetUsers)
}

func (v1 *V1Handler) RegisterReviewRouter(r fiber.Router) {
	reviewRouter := r.Group("/review")

	reviewRouter.Post("/", v1.reviewHandler.CreateReview)
}
