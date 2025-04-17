package archive

import "gorm.io/gorm"

type Repository interface {
	Save(userID int64, activityID string) error
	Delete(userID int64, activityID string) error
	Find(userID int64, activityID string) (bool, error)
}

type repo struct{ db *gorm.DB }

func NewRepository(db *gorm.DB) Repository { return &repo{db} }

func (r *repo) Save(u int64, a string) error {
	return r.db.Create(&ArchivedActivity{UserID: u, ActivityID: a}).Error
}

func (r *repo) Delete(u int64, a string) error {
	return r.db.Where("user_id=? AND activity_id=?", u, a).Delete(&ArchivedActivity{}).Error
}

func (r *repo) Find(u int64, a string) (bool, error) {
	var count int64
	err := r.db.Model(&ArchivedActivity{}).Where("user_id=? AND activity_id=?", u, a).Count(&count).Error
	return count > 0, err
}
