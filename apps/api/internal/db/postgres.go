package db

import (
	"context"
	"fmt"
	"log"

	"github.com/capmoo/api/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

var conn *pgxpool.Pool

func InitDB(cfg config.DatabaseConfig) error {
	var err error

	// Connect to the database using pgxpool
	conn, err := pgxpool.New(context.Background(), cfg.Url)
	if err != nil {
		return fmt.Errorf("unable to connect to database: %v", err)
	}

	// Ping the database to make sure the connection works
	if err := conn.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping the database: %v", err)
	}

	// Test the connection with a simple query
	var greeting string
	err = conn.QueryRow(context.Background(), "SELECT 'Hello, World!'").Scan(&greeting)
	if err != nil {
		return fmt.Errorf("failed to test PostgreSQL connection: %v", err)
	}

	// Log the successful test
	log.Printf("Successfully connected to PostgreSQL! Greeting: %s", greeting)

	return nil
}

// CloseDB closes the connection pool
func CloseDB() {
	conn.Close()
	log.Println("Database connections closed successfully")
}
