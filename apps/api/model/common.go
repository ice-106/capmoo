package model

import "time"

type Model struct {
	Id        uint       `gorm:"primaryKey;autoIncrement"`
	CreatedAt time.Time  `gorm:"autoCreateTime:milli"`
	UpdatedAt *time.Time `gorm:"autoUpdateTime:milli"`
}
