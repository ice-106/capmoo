package database

import (
	"log/slog"
	"time"

	"github.com/capmoo/api/config"
	"github.com/capmoo/api/logger/gormslog"
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
