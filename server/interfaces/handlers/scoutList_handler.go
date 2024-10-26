package handlers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type ScoutHandler struct {
	scoutUsecase usecase.IScoutListUsecase
}

func NewScoutListHandler(usecase usecase.IScoutListUsecase) *ScoutHandler {
	return &ScoutHandler{
		scoutUsecase: usecase,
	}
}

type IScoutListHandler interface {
	GetCommunityDetailByScoutList(ctx *gin.Context)
	CreateScout(ctx *gin.Context)
	ChangeStatus(ctx *gin.Context)
}

type createScoutRequest struct {
	UserUUID      string `json:"user_uuid"`
	CommunityUUID string `json:"community_uuid"`
}

type changeStatusRequest struct {
	UserUUID string `json:"user_uuid"`
	Status   uint   `json:"status"`
}

func (h *ScoutHandler) GetCommunityDetailByScoutList(ctx *gin.Context) {
	userUUIDStr := ctx.Query("user_uuid")
	userUUID, err := uuid.Parse(userUUIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	scouts, err := h.scoutUsecase.GetWithCommunityDetails(ctx.Request.Context(), userUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scouts)
}

func (h *ScoutHandler) CreateScout(ctx *gin.Context) {
	var req createScoutRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	userUUID, err := uuid.Parse(req.UserUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user UUID format"})
		return
	}

	communityUUID, err := uuid.Parse(req.CommunityUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid community UUID format"})
		return
	}

	scoutDetail := &models.ScoutList{
		User_UUID:      userUUID,
		Status:         0, // 最初は未読(0)で登録
		Community_UUID: communityUUID,
	}

	if err := h.scoutUsecase.Create(ctx.Request.Context(), scoutDetail); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusCreated)
}

func (h *ScoutHandler) ChangeStatus(ctx *gin.Context) {
	var req changeStatusRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	userUUID, err := uuid.Parse(req.UserUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	if err := h.scoutUsecase.ChangeStatus(ctx.Request.Context(), userUUID, req.Status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusOK)
}
