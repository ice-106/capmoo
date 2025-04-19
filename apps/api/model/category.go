package model

type Category struct {
	Model

	Name string `gorm:"not null"`

	Activities []Activity `gorm:"foreignKey:CategoryId"`
}

func (Category) TableName() string {
	return "categories"
}
