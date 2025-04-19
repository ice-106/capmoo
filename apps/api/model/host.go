package model

type Host struct {
	Model

	Name       string  `gorm:"not null"`
	Contact    string  `gorm:"not null"`
	IsVerified bool    `gorm:"not null"`
	AvgRating  float64 `gorm:"not null"`

	Activities []Activity `gorm:"foreignKey:HostId"`
}

func (Host) TableName() string {
	return "hosts"
}
