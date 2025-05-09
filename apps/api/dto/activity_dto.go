package dto

import "time"

type CreateActivityRequest struct {
	Name             string    `json:"name" binding:"required"`
	Description      string    `json:"description" binding:"required"`
	StartDateTime    time.Time `json:"start_date_time" binding:"required"`
	EndDateTime      time.Time `json:"end_date_time" binding:"required"`
	Price            float64   `json:"price" binding:"required"`
	RemainSlot       int       `json:"remain_slot" binding:"required"`
	MaxParticipation int       `json:"max_participation" binding:"required"`
	Images           []string  `json:"images" binding:"required"`
	CategoryId       uint      `json:"category_id" binding:"required"`
	LocationId       uint      `json:"location_id" binding:"required"`
	HostId           uint      `json:"host_id" binding:"required"`
}

type GetActivitiesResponse struct {
	Id         uint   `json:"id"`
	Name       string `json:"name"`
	CategoryId uint   `json:"category_id"`
	LocationId uint   `json:"location_id"`
}

type GetLocationsResponse struct {
	Id       uint   `json:"id"`
	Province string `json:"province"`
}

type GetCategoriesResponse struct {
	Id   uint   `json:"id"`
	Name string `json:"name"`
}

type GetActivityResponse struct {
	Id               uint       `json:"id"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        *time.Time `json:"updated_at"`
	Name             string     `json:"name"`
	Description      string     `json:"description"`
	StartDateTime    time.Time  `json:"start_date_time"`
	EndDateTime      time.Time  `json:"end_date_time"`
	Price            float64    `json:"price"`
	RemainSlot       int        `json:"remain_slot"`
	MaxParticipation int        `json:"max_participation"`
	Images           []string   `json:"images"`
}

type GetActivityDetailResponse struct {
	Id               uint                  `json:"id"`
	CreatedAt        time.Time             `json:"created_at"`
	UpdatedAt        *time.Time            `json:"updated_at"`
	Name             string                `json:"name"`
	Description      string                `json:"description"`
	StartDateTime    time.Time             `json:"start_date_time"`
	EndDateTime      time.Time             `json:"end_date_time"`
	Price            float64               `json:"price"`
	RemainSlot       int                   `json:"remain_slot"`
	MaxParticipation int                   `json:"max_participation"`
	Images           []string              `json:"images"`
	Category         GetCategoriesResponse `json:"category"`
	Location         GetLocationsResponse  `json:"location"`
}

type UploadActivityImageResponse struct {
	FileUrl string `json:"file_url"`
}
