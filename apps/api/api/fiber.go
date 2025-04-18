package api

import (
	"log/slog"
	"runtime/debug"

	"github.com/gofiber/fiber/v2"
)

func HandleError(c *fiber.Ctx, err error) error {
	slog.WarnContext(c.UserContext(), "Unexpected error from fiber",
		"error", err)
	return InternalServerError(c)
}

func HandlePanicStackTrace(c *fiber.Ctx, v any) {
	slog.WarnContext(c.UserContext(),
		"Panic occurred in fiber handler",
		"error", v,
		"stack", string(debug.Stack()),
	)
}
