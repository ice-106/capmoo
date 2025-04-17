package archive

import "time"

type ArchivedActivity struct {
	ID         int64     `gorm:"primaryKey"`
	UserID     int64     `gorm:"index;not null"`
	ActivityID string    `gorm:"size:64;not null"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
}
