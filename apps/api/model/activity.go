package model

import "time"

type Activity struct {
	Model

	Name             string    `gorm:"not null"`
	Category         string    `gorm:"not null"` // normalize to another table ?
	Description      string    `gorm:"not null"`
	StartDateTime    time.Time `gorm:"not null"`
	EndDateTime      time.Time `gorm:"not null"`
	Price            float64   `gorm:"not null"`
	RemainSlot       int       `gorm:"not null"`
	MaxParticipation int       `gorm:"not null"`

	Reviews    []Review `gorm:"foreignKey:ActivityId"`
	HostId     uint     `gorm:"not null"`
	Host       Host     `gorm:"foreignKey:HostId"`
	LocationId uint     `gorm:"not null"`
	Location   Location `gorm:"foreignKey:LocationId"`
}

func (Activity) TableName() string {
	return "activities"
}
