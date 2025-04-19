package model

import (
	"database/sql/driver"
	"fmt"
)

type PaymentStatus string

const (
	PaymentStatusUnknown   PaymentStatus = "UNKNOWN"
	PaymentStatusCancelled PaymentStatus = "CANCELLED"
	PaymentStatusFailed    PaymentStatus = "FAILED"
	PaymentStatusPending   PaymentStatus = "PENDING"
	PaymentStatusSuccess   PaymentStatus = "SUCCESS"
)

func (s *PaymentStatus) Scan(value interface{}) error {
	strVal, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid data type for PaymentStatus: %T", value)
	}

	switch PaymentStatus(strVal) {
	case PaymentStatusUnknown, PaymentStatusCancelled, PaymentStatusFailed, PaymentStatusPending, PaymentStatusSuccess:
		*s = PaymentStatus(strVal)
		return nil
	default:
		return fmt.Errorf("invalid value for PaymentStatus: %s", strVal)
	}
}

func (s PaymentStatus) Value() (driver.Value, error) {
	switch s {
	case PaymentStatusUnknown, PaymentStatusCancelled, PaymentStatusFailed, PaymentStatusPending, PaymentStatusSuccess:
		return string(s), nil
	default:
		return nil, fmt.Errorf("invalid value for PaymentStatus: %s", s)
	}
}
