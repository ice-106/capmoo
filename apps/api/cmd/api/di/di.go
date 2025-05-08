package di

import (
	"context"
	"fmt"
	"reflect"

	"github.com/capmoo/api/config"
	"github.com/capmoo/api/database"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/handler"
	"github.com/capmoo/api/middleware"
	"github.com/capmoo/api/repository"
	"github.com/capmoo/api/route"
	"github.com/go-playground/validator/v10"
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

	database.Migrate(gormDB)
	database.Seed(gormDB)

	// validator
	validator := validator.New(validator.WithRequiredStructEnabled())

	// repository
	userRepository := repository.NewUserRepository(gormDB)
	activityRepository := repository.NewActivityRepository(gormDB)
	surveryRepository := repository.NewSurveyRepository(gormDB)
	reviewRepository := repository.NewReviewRepository(gormDB)

	// domain
	authDomain := domain.NewAuthDomain(cfg)
	userDomain := domain.NewUserDomain(userRepository)
	surveyDomain := domain.NewSurveyDomain(surveryRepository)
	reviewDomain := domain.NewReviewDomain(reviewRepository)
	activityDomain := domain.ActivityDomain(activityRepository)

	// handler
	userHandler := handler.NewUserHandler(userDomain, validator, reviewDomain)
	activityHandler := handler.NewActivityHandler(activityDomain, validator, reviewDomain)
	surveyHandler := handler.NewSurveyHandler(surveyDomain, validator)

	// middleware
	authMiddleware := middleware.NewAuthMiddleware(authDomain, userDomain)

	// route
	v1Handler := route.V1NewHandler(authMiddleware, userHandler, surveyHandler, activityHandler)

	return v1Handler, nil
}
