package middleware

import (
	"log/slog"
	"strings"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/model"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AuthMiddleware struct {
	authDomain domain.AuthDomain
	userDomain domain.UserDomain
}

func NewAuthMiddleware(authDomain domain.AuthDomain, userDomain domain.UserDomain) *AuthMiddleware {
	return &AuthMiddleware{
		authDomain: authDomain,
		userDomain: userDomain,
	}
}

func (a *AuthMiddleware) Handler(c *fiber.Ctx) error {
	authHeaders, ok := c.GetReqHeaders()["Authorization"]
	if !ok {
		return api.SendError(c, fiber.StatusUnauthorized, api.Error{
			Code:    "INVALID_HEADER",
			Message: "Invalid Authorization header, expected Bearer token",
		})
	}

	authHeader := authHeaders[0]
	authToken := authToken(authHeader)
	if authToken == "" {
		return api.SendError(c, fiber.StatusUnauthorized, api.Error{
			Code:    "INVALID_HEADER",
			Message: "Invalid Authorization header, expected Bearer token",
		})
	}

	userInfo, err := a.authDomain.ValidateAccessToken(authToken)
	if err != nil {
		slog.InfoContext(c.Context(), "Failed to validate access token", "error", err)
		return api.SendError(c, fiber.StatusUnauthorized, api.Error{
			Code:    "INVALID_TOKEN",
			Message: "Invalid access token",
		})
	}

	userOidcIdUuid, err := uuid.Parse(userInfo.Sub)
	if err != nil {
		return api.SendError(c, fiber.StatusUnauthorized, api.Error{
			Code:    "INTERNAL_SERVER_ERROR",
			Message: "Can't parse user OIDC ID",
		})
	}

	createdUser, err := a.userDomain.CreateUserIfNotExists(c.Context(), &model.User{
		Name:   userInfo.Name,
		Email:  userInfo.Email,
		OidcId: userOidcIdUuid,
	})
	if err != nil {
		return api.SendError(c, fiber.StatusInternalServerError, api.Error{
			Code:    "INTERNAL_SERVER_ERROR",
			Message: "Can't create user",
		})
	}

	api.SetUserIDInContext(c, createdUser.Id)

	return c.Next()
}

func authToken(authHeader string) string {
	if strings.HasPrefix(authHeader, "Bearer ") {
		return authHeader[7:]
	}
	return ""
}
