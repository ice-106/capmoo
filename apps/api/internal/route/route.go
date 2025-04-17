package route

import (
	"github.com/gofiber/fiber/v2"
	// middlewares "github.com/capmoo/api/internal/middleware"
)

func V1NewHandler() *V1Handler {
	return &V1Handler{}
}

type V1Handler struct {
	Archive *ArchiveHandler
}

func (v1 *V1Handler) RegisterV1Router(r fiber.Router) {
	// v1Router := r.Group("/v1")
	v1Router := r.Group("/v1")
	
	if v1.Archive != nil {
		v1.Archive.Register(v1Router)
	}
}
