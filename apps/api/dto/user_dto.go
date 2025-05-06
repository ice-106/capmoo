package dto

import "time"

type GetUsersResponse struct {
	Id        uint       `json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
	OidcId    string     `json:"oidc_id"`
}

type GetActivitiesResponse struct {
	Id               uint      `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	StartDateTime    time.Time `json:"start_date_time"`
	EndDateTime      time.Time `json:"end_date_time"`
	Price            float64   `json:"price"`
	RemainSlot       int       `json:"remain_slot"`
	MaxParticipation int       `json:"max_participation"`
	CategoryId       uint      `json:"category_id"`
	HostId           uint      `json:"host_id"`
	LocationId       uint      `json:"location_id"`
}
