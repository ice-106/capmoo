package model

type Location struct {
	Model

	District  string  `gorm:"not null"`
	Province  string  `gorm:"not null"`
	Country   string  `gorm:"not null"`
	Latitude  float64 `gorm:"not null"`
	Longitude float64 `gorm:"not null"`

	Activities []Activity `gorm:"foreignKey:LocationId"`
}

func (Location) TableName() string {
	return "locations"
}
