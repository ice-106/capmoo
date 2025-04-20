package middleware

import (
	"context"
	"log/slog"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

type MiddlewareContextKey string

const (
	RequestIDKey MiddlewareContextKey = "request_id"
)

func SetupUserContext(c *fiber.Ctx) error {
	rctx := c.Context()

	var ctx context.Context = rctx

	requestID := c.Locals(requestid.ConfigDefault.ContextKey)
	if requestID != nil {
		ctx = context.WithValue(ctx, RequestIDKey, requestID)
	} else {
		slog.WarnContext(ctx, "Request ID not found in fiber context")
	}

	c.SetUserContext(ctx)
	return c.Next()
}
