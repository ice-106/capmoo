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
	"github.com/jackc/pgx/v5/pgxpool"

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
	dbPool, err := pgxpool.New(context.Background(), cfg.Database.Url)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer dbPool.Close()

	// Test the connection with a simple query
	var greeting string
	err = dbPool.QueryRow(ctx, "SELECT 'Hello, World!'").Scan(&greeting)
	if err != nil {
		slog.Error("failed to test PostgreSQL connection", "error", err)
		os.Exit(1)
		return
	}

	// Log the successful connection test
	log.Printf("Successfully connected to PostgreSQL! Greeting: %s", greeting)

	rows, err := dbPool.Query(ctx, `
		SELECT schema_name 
		FROM information_schema.schemata;
	`)
	if err != nil {
		log.Fatal("Failed to query tables:", err)
	}
	defer rows.Close()

	for rows.Next() {
		var tableName string
		if err := rows.Scan(&tableName); err != nil {
			log.Fatal("Failed to scan table name:", err)
		}
		fmt.Println("Table:", tableName)
	}
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
