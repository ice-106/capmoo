package errorutil

import (
	"errors"

	"github.com/joomcode/errorx"
)

func WithStack(err error) error {
	if err == nil {
		return nil
	}
	return errorx.EnsureStackTrace(err)
}

func Must[T any](v T, err error) T {
	if err != nil {
		panic(err)
	}
	return v
}

func JoinsWithStack(errs ...error) error {
	return WithStack(errors.Join(errs...))
}

//nolint:all
func UnwrapErrorx(err error) error {
	res := err
	errx, ok := res.(*errorx.Error)
	for ok {
		res = errx.Cause()
		errx, ok = res.(*errorx.Error)
	}
	return res
}
