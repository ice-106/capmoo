package middleware

import (
	"log"
	"strings"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/gofiber/fiber/v2"
)

type AuthMiddleware struct {
	authDomain *domain.AuthDomain
}

func NewAuthMiddleware(authDomain *domain.AuthDomain) *AuthMiddleware {
	return &AuthMiddleware{
		authDomain: authDomain,
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
		return api.SendError(c, fiber.StatusUnauthorized, api.Error{
			Code:    "INVALID_TOKEN",
			Message: "Invalid access token",
		})
	}

	userOidcId := userInfo.Sub

	log.Println("userOidcId", userOidcId)

	// TODO: set user ID in context

	return c.Next()
}

func authToken(authHeader string) string {
	if strings.HasPrefix(authHeader, "Bearer ") {
		return authHeader[7:]
	}
	return ""
}
