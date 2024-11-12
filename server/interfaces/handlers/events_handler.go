package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/usecase"
	"log"
	"net/http"
	"time"
)

type eventHandler struct {
	eventUsecase     usecase.IEventUsecase
	communityUsecase usecase.ICommunityUsecase
}

func NewEventHandler(eventUsecase usecase.IEventUsecase, communityUsecase usecase.ICommunityUsecase) *eventHandler {
	return &eventHandler{eventUsecase: eventUsecase, communityUsecase: communityUsecase}
}

func (h *eventHandler) GetAllEvents(ctx *gin.Context) {
	events, err := h.eventUsecase.GetAllEvents(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := make([]map[string]interface{}, len(events))
	for i, event := range events {
		community, err := h.communityUsecase.FindByID(ctx, usecase.InputCommunityFindByID{event.CommunityUUID})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch community details"})
			return
		}

		response[i] = map[string]interface{}{
			"community_uuid": event.CommunityUUID,
			"community_info": map[string]interface{}{
				"name": community.Name,
				"img":  community.Img,
			},
			"img":      event.Img,
			"title":    event.Title,
			"detailed": event.Detailed,
			"date":     event.Date.Format("2006-01-02"),
			"tag":      event.Tags,
		}
	}

	ctx.JSON(http.StatusOK, response)
}

func (h *eventHandler) CreateEvent(ctx *gin.Context) {
	var req struct {
		CommunityUUID string `json:"community_uuid"`
		Title         string `json:"title"`
		Img           string `json:"img"`
		Detailed      string `json:"detailed"`
		Date          string `json:"date"`
		Tags          []int  `json:"tags"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	communityUUID, err := uuid.Parse(req.CommunityUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid community UUID format"})
		return
	}

	log.Println(req.Date)

	date, err := time.Parse(time.RFC3339, req.Date) // Adjust date format as needed
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	event := &models.Event{
		CommunityUUID: communityUUID,
		Title:         req.Title,
		Img:           req.Img,
		Detailed:      req.Detailed,
		Date:          date,
		Tags:          models.IntArray(req.Tags),
	}

	if err := h.eventUsecase.CreateEvent(ctx, event); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusCreated)
}

func (h *eventHandler) UpdateEvent(ctx *gin.Context) {
	var req struct {
		ID            uint   `json:"id"`
		CommunityUUID string `json:"community_uuid"`
		Title         string `json:"title"`
		Img           string `json:"img"`
		Detailed      string `json:"detailed"`
		Date          string `json:"date"`
		Tags          []int  `json:"tags"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	communityUUID, err := uuid.Parse(req.CommunityUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid community UUID format"})
		return
	}

	date, err := time.Parse("2006-01-02", req.Date) // Adjust date format as needed
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
		return
	}

	event := &models.Event{
		ID:            req.ID,
		CommunityUUID: communityUUID,
		Title:         req.Title,
		Img:           req.Img,
		Detailed:      req.Detailed,
		Date:          date,
		Tags:          models.IntArray(req.Tags),
	}

	if err := h.eventUsecase.UpdateEvent(ctx, event); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}
