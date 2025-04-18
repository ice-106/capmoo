package middleware

import (
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

func AccessLogMiddleware(c *fiber.Ctx) error {
	err := c.Next()

	path := c.Path()
	method := c.Method()
	status := c.Response().StatusCode()
	slog.InfoContext(c.UserContext(), "access log",
		"path", method+" "+path,
		"status", status,
		"req_body", string(c.Body()),
		"query", c.Queries(),
	)

	return err
}
