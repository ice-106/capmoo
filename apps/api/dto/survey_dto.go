package dto

type CreateUserPreferenceRequest struct {
	Preferences []string `json:"preferences" validate:"required" example:"[\"sports\", \"shopping\"]"`
}

type GetUserPreferenceResponse struct {
	Preferences []string `json:"preferences"`
}
