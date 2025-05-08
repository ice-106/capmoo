package model

import "github.com/google/uuid"

type User struct {
	Model

	Name   string    `gorm:"size:100;not null"`
	Email  string    `gorm:"size:100;uniqueIndex;not null"`
	OidcId uuid.UUID `gorm:"size:36;uniqueIndex"`

	TravelTypes []TravelType `gorm:"many2many:user_travel_types"`
	Preferences []Preference `gorm:"many2many:user_preferences"`
	Concerns    []Concern    `gorm:"many2many:user_concerns"`
	Reviews     []Review     `gorm:"foreignKey:UserId"`
	Bookings    []Booking    `gorm:"foreignKey:UserId"`

	ActivitiesArchives  []Activity `gorm:"many2many:user_activities_archives"`
	ActivitiesSchedules []Activity `gorm:"many2many:user_activities_schedules"`
}

func (User) TableName() string {
	return "users"
}
