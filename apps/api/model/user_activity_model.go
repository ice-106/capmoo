package model

type UserActivity struct {
	UserId     uint `gorm:"primaryKey"`
	ActivityId uint `gorm:"primaryKey"`
}

func (UserActivity) TableName() string {
	return "user_activities"
}
