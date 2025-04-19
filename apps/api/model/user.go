package model

import "github.com/google/uuid"

type User struct {
	Model

	OidcId uuid.UUID `gorm:"size:36;uniqueIndex"`

	TravelTypes []TravelType `gorm:"many2many:user_travel_types"`
	Preferences []Preference `gorm:"many2many:user_preferences"`
	Concerns    []Concern    `gorm:"many2many:user_concerns"`
	Reviews     []Review     `gorm:"foreignKey:UserId"`
	Bookings    []Booking    `gorm:"foreignKey:UserId"`
}

func (User) TableName() string {
	return "users"
}
