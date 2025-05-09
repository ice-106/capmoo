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
			
			INSERT INTO categories (name, created_at, updated_at)
			VALUES
				('adventure', NOW(), NOW()),
				('cultural', NOW(), NOW()),
				('educational', NOW(), NOW()),
				('entertainment', NOW(), NOW()),
				('nature', NOW(), NOW()),
				('religious', NOW(), NOW()),
				('shopping', NOW(), NOW()),
				('sports', NOW(), NOW())
			ON CONFLICT (name) DO NOTHING;
			
			INSERT INTO hosts (name, contact, is_verified, avg_rating, created_at, updated_at)
			SELECT 'John Doe', 'johndoe@example.com', true, 4.5, NOW(), NOW()
			WHERE NOT EXISTS (
				SELECT 1 FROM hosts WHERE name = 'John Doe' AND contact = 'johndoe@example.com'
			);

			INSERT INTO locations (district, province, country, latitude, longitude, created_at, updated_at)
			SELECT 'Samyan', 'Bangkok', 'Thailand', 13.7563, 100.5018, NOW(), NOW()
			WHERE NOT EXISTS (
				SELECT 1 FROM locations WHERE district = 'Samyan' AND province = 'Bangkok' AND country = 'Thailand'
			);
			
			INSERT INTO activities (
				name,
				description,
				start_date_time,
				end_date_time,
				price,
				remain_slot,
				max_participation,
				images,
				category_id,
				host_id,
				location_id,
				created_at,
				updated_at
			)
			SELECT
				'Dream World Bangkok Thrills, Snow & Fantasy',
				'Dream World Bangkok is a vibrant amusement park offering over 40 rides and attractions spread across seven themed zones. From thrilling roller coasters to enchanting snow experiences, its a perfect destination for families and adventure enthusiasts.',
				'2025-05-15 17:00:00',
				'2025-05-15 19:00:00',
				45.00,
				1000,
				30,
				ARRAY['activities/activity_4_20250509_071042.jpg'],
				1,
				1,
				1,
				NOW(),
				NOW()
			WHERE NOT EXISTS (
				SELECT 1 FROM activities WHERE name = 'Dream World Bangkok Thrills, Snow & Fantasy' AND host_id = 1 AND location_id = 1
			);
		END $$;
	`).Error; err != nil {
		return fmt.Errorf("failed to seed database: %w", err)
	}

	return nil
}
