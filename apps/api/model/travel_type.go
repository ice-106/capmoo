package model

type TravelType struct {
	Model

	Name string `gorm:"not null"`

	Users []User `gorm:"many2many:user_travel_types;"`
}

func (TravelType) TableName() string {
	return "travel_types"
}
