package model

import "time"

type Activity struct {
	Model

	Name string `gorm:"not null"`

	Description      string    `gorm:"not null"`
	StartDateTime    time.Time `gorm:"not null"`
	EndDateTime      time.Time `gorm:"not null"`
	Price            float64   `gorm:"not null;default:0;check:price >= 0"`
	RemainSlot       int       `gorm:"not null"`
	MaxParticipation int       `gorm:"not null;default:0;check:max_participation > 0"`

	CategoryId uint     `gorm:"not null"`
	Category   Category `gorm:"foreignKey:CategoryId"`
	HostId     uint     `gorm:"not null"`
	Host       Host     `gorm:"foreignKey:HostId"`
	LocationId uint     `gorm:"not null"`
	Location   Location `gorm:"foreignKey:LocationId"`
	Reviews    []Review `gorm:"foreignKey:ActivityId"`
}

func (Activity) TableName() string {
	return "activities"
}
