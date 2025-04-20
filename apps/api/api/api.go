package api

import "github.com/gofiber/fiber/v2"

type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type WithError struct {
	Error Error `json:"error"`
}

type WithData[T any] struct {
	Data T `json:"data"`
}

func Ok[T any](c *fiber.Ctx, data T) error {
	res := WithData[T]{
		Data: data,
	}
	return c.JSON(res)
}

func OkNoContent(c *fiber.Ctx) error {
	return c.SendStatus(fiber.StatusNoContent)
}

func SendError(c *fiber.Ctx, status int, err Error) error {
	res := WithError{
		Error: err,
	}
	return c.Status(status).JSON(res)
}

func BadInput(c *fiber.Ctx) error {
	return SendError(c, fiber.StatusBadRequest, Error{
		Code:    "BAD_INPUT",
		Message: "The input is invalid, please check again",
	})
}

func BadInputWithMessage(c *fiber.Ctx, code, message string) error {
	return SendError(c, fiber.StatusBadRequest, Error{
		Code:    code,
		Message: message,
	})
}

func Forbidden(c *fiber.Ctx) error {
	return SendError(c, fiber.StatusForbidden, Error{
		Code:    "FORBIDDEN",
		Message: "User doesn't have permission to access this resource",
	})
}

func ForbiddenWithMessage(c *fiber.Ctx, message string) error {
	return SendError(c, fiber.StatusForbidden, Error{
		Code:    "FORBIDDEN",
		Message: message,
	})
}

func ConflictWithMessage(c *fiber.Ctx, code, message string) error {
	return SendError(c, fiber.StatusConflict, Error{
		Code:    code,
		Message: message,
	})
}

func InternalServerError(c *fiber.Ctx) error {
	return SendError(c, fiber.StatusInternalServerError, Error{
		Code:    "INTERNAL_SERVER_ERROR",
		Message: "Something went wrong, please try again later",
	})
}

func NotFound(c *fiber.Ctx) error {
	return SendError(c, fiber.StatusNotFound, Error{
		Code:    "NOT_FOUND",
		Message: "The requested resource is not found",
	})
}

func Unauthorized(c *fiber.Ctx) error {
	return SendError(c, fiber.StatusUnauthorized, Error{
		Code:    "UNAUTHORIZED",
		Message: "You are not authorized to access this resource",
	})
}
