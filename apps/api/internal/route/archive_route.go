package route

import (
	"github.com/capmoo/api/internal/api"
	"github.com/capmoo/api/internal/domain/archive"
	"github.com/gofiber/fiber/v2"
)

type ArchiveHandler struct{ svc archive.Service }

func NewArchiveHandler(s archive.Service) *ArchiveHandler { return &ArchiveHandler{s} }

func (h *ArchiveHandler) Register(r fiber.Router) {
	r.Post("/activities/:id/archive", h.toggle) // POST /v1/activities/{id}/archive
}

func (h *ArchiveHandler) toggle(c *fiber.Ctx) error {
	uid, err := api.GetUserIDFromContext(c)           // <–*ใช้ auth จริงทีหลัง*
	if err != nil { uid = 1 }                         // *** dev‑hack: user#1 ***
	saved, err := h.svc.Toggle(int64(uid), c.Params("id"))
	if err != nil {
		return api.InternalServerError(c)
	}
	return api.Ok(c, fiber.Map{"saved": saved})
}
