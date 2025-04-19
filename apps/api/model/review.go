package model

type Review struct {
	Model

	Rating  int    `gorm:"not null"`
	Comment string `gorm:"not null"`

	UserId     uint     `gorm:"not null"`
	User       User     `gorm:"foreignKey:UserId"`
	ActivityId uint     `gorm:"not null"`
	Activity   Activity `gorm:"foreignKey:ActivityId"`
}

func (Review) TableName() string {
	return "reviews"
}
