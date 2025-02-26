package di

import (
	"context"
	"fmt"
	"reflect"

	"github.com/capmoo/api/internal/config"
	"github.com/capmoo/api/internal/route"
)

// must used to panic if error is not nil.
// It is used to simplify error handling in DI.
func must[T any](t T, err error) T {
	if err != nil {
		typeName := reflect.TypeOf(t).String()
		err := fmt.Errorf("failed to initialize %s: %w", typeName, err)
		panic(err)
	}
	return t
}

func InitDI(ctx context.Context, cfg *config.AppConfig) (r *route.V1Handler, err error) {
	defer func() {
		if r := recover(); r != nil {
			if e, ok := r.(error); ok {
				err = e
			} else {
				err = fmt.Errorf("%v", r)
			}
		}
	}()

	v1Handler := must(route.V1NewHandler(), nil)

	return v1Handler, nil
}
