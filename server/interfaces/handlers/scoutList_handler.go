package handlers

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
	"strconv"
	"time"
)

type ScoutHandler struct {
	scoutUsecase     usecase.IScoutListUsecase
	userUsecase      usecase.IUesrUsecase
	communityUsecase usecase.ICommunityUsecase
}

func NewScoutListHandler(usecase usecase.IScoutListUsecase, userUsecase usecase.IUesrUsecase) *ScoutHandler {
	return &ScoutHandler{
		scoutUsecase: usecase,
		userUsecase:  userUsecase,
	}
}

type IScoutListHandler interface {
	GetCommunityDetailByScoutList(ctx *gin.Context)
	GetCommunityDetailWithScoutList(ctx *gin.Context)
	//GetUserDetailByScoutList(ctx *gin.Context)
	CreateScouts(ctx *gin.Context)
	ChangeStatus(ctx *gin.Context)
}

type changeStatusRequest struct {
	ID     uint               `json:"id"`
	Status models.ScoutStatus `json:"status"`
}

type UUIDItem struct {
	UserUUID string `json:"user_uuid"`
}

type CreateScoutsRequest struct {
	Content       string     `json:"content"`
	CommunityUUID string     `json:"community_uuid"`
	UUIDs         []UUIDItem `json:"uuids"`
}

func (h *ScoutHandler) GetCommunityDetailByScoutList(ctx *gin.Context) {
	userUUID := ctx.Query("user_uuid")

	scoutlist, err := h.scoutUsecase.GetWithCommunityDetails(ctx.Request.Context(), userUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scoutlist)
}
func (h *ScoutHandler) GetCommunityDetailWithScoutList(ctx *gin.Context) {
	userUUID := ctx.Query("user_uuid")

	scoutlist, err := h.scoutUsecase.GetCommunityDetailsWithScoutLists(ctx.Request.Context(), userUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scoutlist)
}

func (h *ScoutHandler) GetUserDetailByScoutList(ctx *gin.Context) {
	userUUID := ctx.Query("community_uuid")

	scoutlist, err := h.scoutUsecase.GetWithUserDetail(ctx.Request.Context(), userUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, scoutlist)
}

func (h *ScoutHandler) ChangeStatus(ctx *gin.Context) {
	var req changeStatusRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	id, err := strconv.ParseUint(strconv.Itoa(int(req.ID)), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	if err := h.scoutUsecase.ChangeStatus(ctx.Request.Context(), uint(id), req.Status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusOK)
}

func (h *ScoutHandler) CreateScouts(ctx *gin.Context) {
	var req CreateScoutsRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	communityUUID, err := uuid.Parse(req.CommunityUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid community UUID format"})
		return
	}

	for _, UUID := range req.UUIDs {
		user, err := h.userUsecase.FindByID(
			ctx.Request.Context(),
			usecase.InputUserFindByID{UUID: UUID.UserUUID})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		userUUID, err := uuid.Parse(user.UUID.String())
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user UUID format"})
			return
		}

		scoutDetail := &models.ScoutList{
			User_UUID:      userUUID,
			Status:         models.Unread,
			Scoutdate:      time.Now(),
			Community_UUID: communityUUID,
		}

		if err := h.scoutUsecase.Create(ctx.Request.Context(), scoutDetail, req.Content); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.Status(http.StatusCreated)
}
