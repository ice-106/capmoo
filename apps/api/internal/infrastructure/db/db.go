package db

import (
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func New(dsn string) (*gorm.DB, error) {
	if dsn == "" {
		dsn = os.Getenv("DATABASE_DSN") // ex. "host=localhost user=postgres dbname=capmoo sslmode=disable"
	}
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}

func AutoMigrate(db *gorm.DB, models ...interface{}) *gorm.DB {
	_ = db.AutoMigrate(models...)
	return db
}
