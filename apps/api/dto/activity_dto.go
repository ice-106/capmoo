package dto

import "time"

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

type GetActivityDetailResponse struct {
	Id            uint      `json:"id"`
	Name          string    `json:"name"`
	Description   string    `json:"description"`
	Price         float64   `json:"price"`
	StartDateTime time.Time `json:"startDateTime"`
	Location      string    `json:"location"`
}
