package model

type Preference struct {
	Model

	Name string `gorm:"not null"`

	Users []User `gorm:"many2many:user_preferences;"`
}

func (Preference) TableName() string {
	return "preferences"
}
