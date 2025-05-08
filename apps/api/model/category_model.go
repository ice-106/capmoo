package model

type Category struct {
	Model

	Name string `gorm:"uniqueIndex;size:100;not null"`

	Activities []Activity `gorm:"foreignKey:CategoryId"`
}

func (Category) TableName() string {
	return "categories"
}
