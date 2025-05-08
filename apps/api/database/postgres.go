package database

import (
	"fmt"
	"log/slog"
	"time"

	"github.com/capmoo/api/config"
	"github.com/capmoo/api/logger/gormslog"
	"github.com/capmoo/api/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func New(cfg *config.Config) (*gorm.DB, error) {
	return gorm.Open(postgres.Open(cfg.DatabaseUrl),
		&gorm.Config{
			PrepareStmt:            true,
			SkipDefaultTransaction: true,
			Logger: gormslog.New(slog.Default(), gormslog.GormSlogOption{
				IgnoreNotFound: true,
				SlowThreshold:  500 * time.Millisecond,
			}),
		})
}

func Migrate(db *gorm.DB) error {
	if err := db.Exec(`
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
		return fmt.Errorf("failed to create enum type: %w", err)
	}

	db.AutoMigrate(model.Activity{}, model.Booking{}, model.Concern{}, model.Host{}, model.Location{}, model.Preference{}, model.Review{}, model.TravelType{}, model.User{})

	return nil
}

func Seed(db *gorm.DB) error {
	// preferences: sports, shopping, educational, nature, eating, adventure, workshop, religious
	// concerns: price, availability, promotion, rating, popularity, location
	// travel_types: solo, group
	if err := db.Exec(`
		DO $$ 
		BEGIN
			INSERT INTO preferences (name, created_at, updated_at)
			VALUES 
				('sports', NOW(), NOW()),
				('shopping', NOW(), NOW()),
				('educational', NOW(), NOW()),
				('nature', NOW(), NOW()),
				('eating', NOW(), NOW()),
				('adventure', NOW(), NOW()),
				('workshop', NOW(), NOW()),
				('religious', NOW(), NOW())
			ON CONFLICT (name) DO NOTHING;
			
			INSERT INTO concerns (name, created_at, updated_at)
			VALUES
				('price', NOW(), NOW()),
				('availability', NOW(), NOW()),
				('promotion', NOW(), NOW()),
				('rating', NOW(), NOW()),
				('popularity', NOW(), NOW()),
				('location', NOW(), NOW())
			ON CONFLICT (name) DO NOTHING;

			INSERT INTO travel_types (name, created_at, updated_at)
			VALUES
				('solo', NOW(), NOW()),
				('group', NOW(), NOW())
			ON CONFLICT (name) DO NOTHING;
		END $$;
	`).Error; err != nil {
		return fmt.Errorf("failed to seed database: %w", err)
	}

	return nil
}
