package dto

type CreateUserPreferencesRequest struct {
	Preferences []string `json:"preferences" validate:"required" example:"[\"sports\", \"shopping\"]"`
}

type GetUserPreferencesResponse struct {
	Preferences []string `json:"preferences"`
}

type CreateUserConcernsRequest struct {
	Concerns []string `json:"concerns" validate:"required" example:"[\"price\", \"availability\"]"`
}

type GetUserConcernsResponse struct {
	Concerns []string `json:"concerns"`
}

type CreateUserTravelTypesRequest struct {
	TravelTypes []string `json:"travel_types" validate:"required" example:"[\"solo\"]"`
}

type GetUserTravelTypesResponse struct {
	TravelTypes []string `json:"travel_types"`
}
