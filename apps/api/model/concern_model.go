package model

type Concern struct {
	Model

	Name string `gorm:"uniqueIndex;size:100;not null"`

	Users []User `gorm:"many2many:user_concerns;"`
}

func (Concern) TableName() string {
	return "concerns"
}
