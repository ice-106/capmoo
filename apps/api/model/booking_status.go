package model

import (
	"database/sql/driver"
	"fmt"
)

type BookingStatus string

const (
	BookingStatusUnknown   BookingStatus = "UNKNOWN"
	BookingStatusCancelled BookingStatus = "CANCELLED"
	BookingStatusFailed    BookingStatus = "FAILED"
	BookingStatusPending   BookingStatus = "PENDING"
	BookingStatusSuccess   BookingStatus = "SUCCESS"
)

func (s *BookingStatus) Scan(value interface{}) error {
	strVal, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid data type for BookingStatus: %T", value)
	}

	switch BookingStatus(strVal) {
	case BookingStatusUnknown, BookingStatusCancelled, BookingStatusFailed, BookingStatusPending, BookingStatusSuccess:
		*s = BookingStatus(strVal)
		return nil
	default:
		return fmt.Errorf("invalid value for BookingStatus: %s", strVal)
	}
}

func (s BookingStatus) Value() (driver.Value, error) {
	switch s {
	case BookingStatusUnknown, BookingStatusCancelled, BookingStatusFailed, BookingStatusPending, BookingStatusSuccess:
		return string(s), nil
	default:
		return nil, fmt.Errorf("invalid value for BookingStatus: %s", s)
	}
}
