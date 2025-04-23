package di

import (
	"context"
	"fmt"
	"reflect"

	"github.com/capmoo/api/config"
	"github.com/capmoo/api/database"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/handler"
	"github.com/capmoo/api/model"
	"github.com/capmoo/api/repository"
	"github.com/capmoo/api/route"
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

func InitDI(ctx context.Context, cfg *config.Config) (r *route.V1Handler, err error) {
	defer func() {
		if r := recover(); r != nil {
			if e, ok := r.(error); ok {
				err = e
			} else {
				err = fmt.Errorf("%v", r)
			}
		}
	}()

	gormDB := must(database.New(cfg))

	if err := gormDB.Exec(`
		DO $$ 
		BEGIN
			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
				CREATE TYPE booking_status AS ENUM ('UNKNOWN', 'CANCELLED', 'FAILED', 'PENDING', 'SUCCESS');
			END IF;

			IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
				CREATE TYPE payment_status AS ENUM ('UNKNOWN', 'CANCELLED', 'FAILED', 'PENDING', 'SUCCESS');
			END IF;
		END $$;
	`).Error; err != nil {
		return nil, fmt.Errorf("failed to create enum type: %w", err)
	}

	gormDB.AutoMigrate(model.Activity{}, model.Booking{}, model.Concern{}, model.Host{}, model.Location{}, model.Preference{}, model.Review{}, model.TravelType{}, model.User{}, model.UserActivity{})

	// repository
	userRepository := repository.NewUserRepository(gormDB)

	// domain
	userDomain := domain.UserDomain(userRepository)

	// handler
	userHandler := handler.NewUserHandler(userDomain)

	v1Handler := route.V1NewHandler(userHandler)

	return v1Handler, nil
}
