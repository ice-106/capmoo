package handler

import (
	"log/slog"
	"strconv"
	"strings"

	"github.com/capmoo/api/api"
	"github.com/capmoo/api/domain"
	"github.com/capmoo/api/dto"
	"github.com/gofiber/fiber/v2"
)

type ActivityHandler struct {
	activityDomain domain.ActivityDomain
}

func NewActivityHandler(activityDomain domain.ActivityDomain) *ActivityHandler {
	return &ActivityHandler{
		activityDomain: activityDomain,
	}
}

func (h *ActivityHandler) GetFilteredActivities(c *fiber.Ctx) error {
	ctx := c.Context()

	// Parse query parameters
	searchTerm := c.Query("q", "")
	locations := c.Query("location", "")
	minPrice := c.Query("minPrice", "")
	maxPrice := c.Query("maxPrice", "")
	categories := c.Query("category", "")

	// Convert query parameters to appropriate types
	var minPriceFloat, maxPriceFloat *float64
	if minPrice != "" {
		price, err := strconv.ParseFloat(minPrice, 64)
		if err == nil {
			minPriceFloat = &price
		}
	}
	if maxPrice != "" {
		price, err := strconv.ParseFloat(maxPrice, 64)
		if err == nil {
			maxPriceFloat = &price
		}
	}

	// Split locations and categories into slices
	locationList := []uint{}
	for _, loc := range strings.Split(locations, ",") {
		if loc != "" {
			id, err := strconv.ParseUint(loc, 10, 32)
			if err == nil {
				locationList = append(locationList, uint(id))
			}
		}
	}

	categoryList := []uint{}
	for _, cat := range strings.Split(categories, ",") {
		if cat != "" {
			id, err := strconv.ParseUint(cat, 10, 32)
			if err == nil {
				categoryList = append(categoryList, uint(id))
			}
		}
	}

	// Fetch activities from the domain
	activities, err := h.activityDomain.GetActivitiesByFilters(ctx, searchTerm, locationList, minPriceFloat, maxPriceFloat, categoryList)
	if err != nil {
		slog.InfoContext(ctx, "Unexpected error from GetActivitiesByFilters", "error", err)
		return api.InternalServerError(c)
	}

	// Map activities to response DTO
	response := make([]dto.GetActivitiesResponse, 0, len(activities))
	for _, activity := range activities {
		response = append(response, dto.GetActivitiesResponse{
			Id:               activity.Id,
			Name:             activity.Name,
			Description:      activity.Description,
			StartDateTime:    activity.StartDateTime,
			EndDateTime:      activity.EndDateTime,
			Price:            activity.Price,
			RemainSlot:       activity.RemainSlot,
			MaxParticipation: activity.MaxParticipation,
			CategoryId:       activity.CategoryId,
			HostId:           activity.HostId,
			LocationId:       activity.LocationId,
		})
	}

	return api.Ok(c, response)
}
