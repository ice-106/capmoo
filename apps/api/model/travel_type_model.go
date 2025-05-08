package model

type TravelType struct {
	Model

	Name string `gorm:"uniqueIndex;size:100;not null"`

	Users []User `gorm:"many2many:user_travel_types;"`
}

func (TravelType) TableName() string {
	return "travel_types"
}
