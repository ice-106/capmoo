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
			
			INSERT INTO categories (id, name, created_at, updated_at)
			VALUES
				(1, 'adventure', NOW(), NOW()),
				(2, 'cultural', NOW(), NOW()),
				(3, 'educational', NOW(), NOW()),
				(4, 'entertainment', NOW(), NOW()),
				(5, 'nature', NOW(), NOW()),
				(6, 'religious', NOW(), NOW()),
				(7, 'shopping', NOW(), NOW()),
				(8, 'sports', NOW(), NOW()),
				(9, 'food', NOW(), NOW()),
				(10, 'wellness', NOW(), NOW())
			ON CONFLICT (id) DO NOTHING;
			
			INSERT INTO hosts (id, name, contact, is_verified, avg_rating, created_at, updated_at)
			VALUES
				(1, 'John Doe', 'johndoe@example.com', true, 4.5, NOW(), NOW()),
				(2, 'Bangkok Adventure Co.', 'contact@bangkokadventure.com', true, 4.8, NOW(), NOW()),
				(3, 'Cultural Tours Bangkok', 'info@culturaltours.com', true, 4.7, NOW(), NOW())
			ON CONFLICT (id) DO NOTHING;

			INSERT INTO locations (id, district, province, country, latitude, longitude, created_at, updated_at)
			VALUES
				(1, 'Samyan', 'Bangkok', 'Thailand', 13.7563, 100.5018, NOW(), NOW()),
				(2, 'Siam', 'Bangkok', 'Thailand', 13.7467, 100.5348, NOW(), NOW()),
				(3, 'Chatuchak', 'Bangkok', 'Thailand', 13.8150, 100.5530, NOW(), NOW()),
				(4, 'Thonburi', 'Bangkok', 'Thailand', 13.7211, 100.4871, NOW(), NOW())
			ON CONFLICT (id) DO NOTHING;
		END $$;
	`).Error; err != nil {
		return fmt.Errorf("failed to seed database: %w", err)
	}

	if err := db.Exec(`
		DO $$ 
		BEGIN
			CREATE TEMPORARY TABLE temp_activities (
				name VARCHAR NOT NULL,
				description TEXT NOT NULL,
				start_date_time TIMESTAMP NOT NULL,
				end_date_time TIMESTAMP NOT NULL,
				price DECIMAL(10,2) NOT NULL,
				remain_slot INTEGER NOT NULL,
				max_participation INTEGER NOT NULL,
				images TEXT[] NOT NULL,
				category_id INTEGER NOT NULL,
				host_id INTEGER NOT NULL,
				location_id INTEGER NOT NULL
			);

		INSERT INTO temp_activities 
		(name, description, start_date_time, end_date_time, price, remain_slot, max_participation, images, category_id, host_id, location_id)
		VALUES
			(
				'Dream World Bangkok Thrills, Snow & Fantasy',
				'Dream World Bangkok is a vibrant amusement park offering over 40 rides and attractions spread across seven themed zones. From thrilling roller coasters to enchanting snow experiences, it is a perfect destination for families and adventure enthusiasts.',
				'2025-05-15 17:00:00',
				'2025-05-15 19:00:00',
				45.00,
				1000,
				30,
				ARRAY['activities/activity_4_20250509_071042.jpg'],
				1,
				1,
				1
			),
			(
				'Bangkok Cultural Walking Tour',
				'Explore the rich cultural heritage of Bangkok with a guided walking tour through historic landmarks and temples.',
				'2025-06-01 09:00:00',
				'2025-06-01 12:00:00',
				30.00,
				20,
				20,
				ARRAY['activities/bangkok_walking_tour_20250509_160902.jpg'],
				2,
				3,
				2
			),
			(
				'Chatuchak Weekend Market Shopping Spree',
				'Discover the vibrant Chatuchak Weekend Market, one of the largest markets in the world, with over 15,000 stalls offering everything from clothing to antiques.',
				'2025-06-10 10:00:00',
				'2025-06-10 14:00:00',
				20.00,
				50,
				50,
				ARRAY['activities/chatuchak_market_20250509_160902.jpg'],
				7,
				2,
				3
			),
			(
				'Thonburi Canal Boat Tour',
				'Experience the traditional side of Bangkok with a serene boat tour through the canals of Thonburi.',
				'2025-06-20 15:00:00',
				'2025-06-20 17:00:00',
				25.00,
				15,
				15,
				ARRAY['activities/thonburi_20250509_160902.jpg'],
				5,
				3,
				4
			),
			(
				'Bangkok Night Market Tour',
				'Explore the vibrant night markets of Bangkok, offering a variety of street food, clothing, and souvenirs.',
				'2025-06-25 18:00:00',
				'2025-06-25 22:00:00',
				15.00,
				100,
				50,
				ARRAY['activities/top_5_night_markets_bangkok_1_20250509_160901.jpg'],
				7,
				2,
				1
			),
			(
				'Grand Palace and Wat Phra Kaew Tour',
				'Visit the iconic Grand Palace and the Temple of the Emerald Buddha, a must-see in Bangkok.',
				'2025-07-01 09:00:00',
				'2025-07-01 12:00:00',
				50.00,
				30,
				30,
				ARRAY['activities/wat_phra_keaw_2_20250509_160901.jpg', 'activities/wat_phra_keaw_20250509_160901.jpg'],
				2,
				3,
				2
			),
			(
				'Bangkok Food Tasting Adventure',
				'Embark on a culinary journey through Bangkok, tasting authentic Thai dishes at local eateries.',
				'2025-07-05 17:00:00',
				'2025-07-05 20:00:00',
				40.00,
				25,
				25,
				ARRAY['activities/food_tour_1_20250509_160901.jpg', 'activities/food_tour_2_20250509_160901.jpg'],
				9,
				1,
				3
			),
			(
				'Bangkok Cycling Adventure',
				'Explore Bangkok''s hidden gems on a guided cycling tour through the city''s backstreets and scenic routes.',
				'2025-07-10 08:00:00',
				'2025-07-10 11:00:00',
				35.00,
				20,
				20,
				ARRAY['activities/activity_5_min_20250509_114112.jpg'],
				1,
				2,
				4
			),
			(
				'Asiatique Riverfront Night Experience',
				'Enjoy a night at Asiatique, Bangkok''s open-air mall by the river, featuring shopping, dining, and entertainment.',
				'2025-07-15 18:00:00',
				'2025-07-15 22:00:00',
				20.00,
				50,
				50,
				ARRAY['activities/asiatique_20250509_160954.jpg'],
				7,
				3,
				1
			),
			(
				'Bangkok Temple Hopping Tour',
				'Visit Bangkok''s most famous temples, including Wat Arun, Wat Pho, and Wat Saket.',
				'2025-07-20 09:00:00',
				'2025-07-20 15:00:00',
				60.00,
				15,
				15,
				ARRAY['activities/temple_hopping_4_20250509_160954.jpg', 'activities/temple_hopping_3_20250509_160954.jpg', 'activities/temple_hopping_2_20250509_160954.jpg', 'activities/temple_hopping_20250509_160954.jpg'],
				2,
				3,
				2
			),
			(
				'Lumphini Park Morning Yoga',
				'Start your day with a refreshing yoga session in the serene surroundings of Lumphini Park.',
				'2025-07-30 06:00:00',
				'2025-07-30 07:30:00',
				10.00,
				20,
				20,
				ARRAY['activities/morning_yoga_3_20250509_160953.jpg', 'activities/morning_yoga_2_20250509_160954.jpg', 'activities/morning_yoga_1_20250509_160954.jpg'],
				10,
				2,
				4
			),
			(
				'Bangkok Art and Culture Center Tour',
				'Explore contemporary art and cultural exhibits at the Bangkok Art and Culture Center.',
				'2025-08-05 10:00:00',
				'2025-08-05 12:00:00',
				25.00,
				30,
				30,
				ARRAY['activities/bacc_4_20250509_161030.jpg', 'activities/bacc_3_20250509_161030.jpg', 'activities/bacc_2_20250509_161030.jpg', 'activities/bacc_1_20250509_161030.jpg'],
				3,
				3,
				1
			),
			(
				'Chao Phraya Dinner Cruise',
				'Enjoy a luxurious dinner cruise along the Chao Phraya River, with stunning views of Bangkok''s landmarks.',
				'2025-08-10 19:00:00',
				'2025-08-10 21:00:00',
				70.00,
				50,
				50,
				ARRAY['activities/cruise_3_20250509_161030.jpg', 'activities/cruise_1_20250509_161030.jpg', 'activities/cruise_2_20250509_161030.jpg'],
				5,
				3,
				2
			),
			(
				'Bangkok Cooking Class',
				'Learn to cook authentic Thai dishes with a professional chef in a hands-on cooking class.',
				'2025-08-15 10:00:00',
				'2025-08-15 13:00:00',
				45.00,
				10,
				10,
				ARRAY['activities/cooking_4_20250509_161029.jpg', 'activities/cooking_3_20250509_161030.jpg', 'activities/cooking_2_20250509_161030.jpg', 'activities/cooking_1_20250509_161030.jpg'],
				9,
				1,
				3
			),
			(
				'Bangkok Floating Market Tour',
				'Experience the vibrant atmosphere of Bangkok''s floating markets, where you can shop and enjoy local delicacies.',
				'2025-08-20 08:00:00',
				'2025-08-20 12:00:00',
				30.00,
				25,
				25,
				ARRAY['activities/floatingmarket_2_20250509_161108.jpg', 'activities/floatingmarket_1_20250509_161108.jpg'],
				7,
				2,
				4
			),
			(
				'Bangkok Street Food Tour',
				'Discover the best street food in Bangkok with a guided tour through the city''s bustling food stalls.',
				'2025-08-25 18:00:00',
				'2025-08-25 21:00:00',
				20.00,
				30,
				30,
				ARRAY['activities/street_food_2_20250509_161108.jpg', 'activities/street_food_1_20250509_161108.jpg'],
				9,
				1,
				2
			),
			(
				'Bangkok Historical Canal Tour',
				'Explore Bangkok''s historic canals and learn about the city''s rich cultural heritage.',
				'2025-08-30 09:00:00',
				'2025-08-30 12:00:00',
				35.00,
				20,
				20,
				ARRAY['activities/historical_canal_2_20250509_161108.jpg', 'activities/historical_canal_1_20250509_161108.jpg'],
				2,
				3,
				4
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
				t.name,
				t.description,
				t.start_date_time,
				t.end_date_time,
				t.price,
				t.remain_slot,
				t.max_participation,
				t.images,
				t.category_id,
				t.host_id,
				t.location_id,
				NOW(),
				NOW()
			FROM temp_activities t
			WHERE NOT EXISTS (
				SELECT 1 
				FROM activities a 
				WHERE a.name = t.name 
				AND a.host_id = t.host_id 
				AND a.location_id = t.location_id
			);

			DROP TABLE temp_activities;
		END $$;
	`).Error; err != nil {
		return fmt.Errorf("failed to seed activities data into database: %w", err)
	}

	return nil
}
