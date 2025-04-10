package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/capmoo/api/cmd/api/di"
	"github.com/capmoo/api/internal/api"
	"github.com/capmoo/api/internal/config"
	"github.com/capmoo/api/internal/middleware"
	"github.com/capmoo/api/pkg/logger"
	"github.com/jackc/pgx/v5" // PostgreSQL driver

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	fiberrecover "github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func main() {
	ctx := context.Background()

	defer func() {
		if r := recover(); r != nil {
			slog.Error("recover from panic!",
				slog.Any("err", r),
			)
		}
	}()

	logger.SetupMinimalLogger()
	cfg := config.Load()
	logger.InitLogger(cfg)

	log.Print("Starting API server...")

	// Connect to PostgresSQL using connection string from config
	conn, err := pgx.Connect(ctx, cfg.Database.Url)
	if err != nil {
		slog.Error("failed to connect to PostgreSQL, exiting...", "error", err)
		os.Exit(1)
		return
	}
	defer conn.Close(ctx) // Ensure to close the connection when the app stops

	// Test the connection with a simple query
	var greeting string
	err = conn.QueryRow(ctx, "SELECT 'Hello, World!'").Scan(&greeting)
	if err != nil {
		slog.Error("failed to test PostgreSQL connection", "error", err)
		os.Exit(1)
		return
	}

	// Log the successful connection test
	log.Print("Successfully connected to PostgreSQL!")

	// End test

	v1Handler, err := di.InitDI(ctx, cfg)
	if err != nil {
		slog.Error("failed to initialize DI, exiting...",
			"error", err)
		os.Exit(1)
		return
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: api.HandleError,
	})

	app.Use(
		cors.New(cors.Config{
			AllowOrigins: cfg.Cors.AllowOrigins,
			AllowHeaders: cfg.Cors.AllowHeaders,
		}),
		requestid.New(),
		middleware.SetupUserContext,
		middleware.AccessLogMiddleware,
		fiberrecover.New(
			fiberrecover.Config{
				Next:              nil,
				EnableStackTrace:  true,
				StackTraceHandler: api.HandlePanicStackTrace,
			},
		),
	)

	v1Handler.RegisterV1Router(app)

	log.Fatal(app.Listen(
		fmt.Sprintf(":%d", cfg.Port),
	))
}
