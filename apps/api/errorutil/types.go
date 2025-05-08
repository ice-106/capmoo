package errorutil

import "github.com/joomcode/errorx"

var (
	RepositoryError = errorx.NewNamespace("repository_error")
	DomainError     = errorx.NewNamespace("domain_error")
	ConverterError  = errorx.NewNamespace("converter_error")
	ConstantError   = errorx.NewNamespace("constant_error")
)

const (
	RedisErrorType      = "redis_error"
	ConverterErrorType  = "converter_error"
	HTTPErrorType       = "http_error"
	UtilsErrorType      = "utils_error"
	PermissionErrorType = "permission_error"
)

type ErrorMeta[T any] struct {
	Type string
	Data T
}
