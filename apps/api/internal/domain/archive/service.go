package archive

type Service interface {
	Toggle(userID int64, activityID string) (saved bool, err error)
}

type service struct{ repo Repository }

func NewService(r Repository) Service { return &service{r} }

func (s *service) Toggle(u int64, a string) (bool, error) {
	exist, err := s.repo.Find(u, a)
	if err != nil {
		return false, err
	}
	if exist {
		return false, s.repo.Delete(u, a) // un‑save
	}
	return true, s.repo.Save(u, a) // save
}
