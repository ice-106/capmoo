package model

type Preference struct {
	Model

	Name string `gorm:"uniqueIndex;size:100;not null"`

	Users []User `gorm:"many2many:user_preferences;"`
}

func (Preference) TableName() string {
	return "preferences"
}
