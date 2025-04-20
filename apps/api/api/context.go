package api

import (
	"context"
	"errors"
	"log/slog"

	"github.com/gofiber/fiber/v2"
)

type apiContextKey uint

const (
	UserIDKey apiContextKey = iota
	IsBypassAuthKey
)

func SetUserIDInContext(c *fiber.Ctx, userID int) {
	ctx := c.UserContext()

	ctx = context.WithValue(ctx, UserIDKey, userID)

	c.SetUserContext(ctx)
}

func GetUserIDFromContext(c *fiber.Ctx) (int, error) {
	ctx := c.UserContext()

	userID, ok := ctx.Value(UserIDKey).(int)
	if !ok {
		slog.Warn("user ID not found in context but passed the middleware")
		return 0, errors.New("user ID not found in context")
	}

	return userID, nil
}

func MustGetUserIDFromContext(c *fiber.Ctx) int {
	ctx := c.UserContext()

	userID, ok := ctx.Value(UserIDKey).(int)
	if !ok {
		slog.ErrorContext(ctx, "UserID not found in context, this endpoint might not be protected by auth middleware",
			"path", c.Path(),
		)
		panic("UserID not found in context")
	}

	return userID
}

func SetIsBypassAuthInContext(c *fiber.Ctx, isBypass bool) {
	c.Locals(IsBypassAuthKey, isBypass)
}

func GetIsBypassAuthFromContext(c *fiber.Ctx) bool {
	v, ok := c.Locals(IsBypassAuthKey).(bool)
	if !ok {
		return false
	}

	return v
}
