package model

import (
	"time"
)

type Booking struct {
	Model

	BookingDate   time.Time     `gorm:"not null"`
	BookingStatus BookingStatus `gorm:"type:booking_status;not null"`
	PaymentStatus PaymentStatus `gorm:"type:payment_status;not null"`

	UserId     uint     `gorm:"not null"`
	User       User     `gorm:"foreignKey:UserId"`
	ActivityId uint     `gorm:"not null"`
	Activity   Activity `gorm:"foreignKey:ActivityId"`
}

func (Booking) TableName() string {
	return "bookings"
}
