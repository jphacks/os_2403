package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
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
	CreateScout(ctx *gin.Context)
	ChangeStatus(ctx *gin.Context)
	CreateScouts(ctx *gin.Context)
	GetMessageUser(ctx *gin.Context)
}

type createScoutRequest struct {
	UserUUID      string `json:"user_uuid"`
	CommunityUUID string `json:"community_uuid"`
}

type (
	CreateScoutsRequest = usecase.CreateScoutsRequest
)

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

func (h *ScoutHandler) CreateScouts(ctx *gin.Context) {
	var req CreateScoutsRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	users, err := h.userUsecase.FindByTags(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	communityUUID, err := uuid.Parse(req.CommunityUUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid community UUID format"})
		return
	}

	for _, user := range users {
		userUUID, err := uuid.Parse(user.UUID.String())
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user UUID format"})
			return
		}

		scoutDetail := &models.ScoutList{
			User_UUID:      userUUID,
			Status:         0, // 最初は未読(0)で登録
			Community_UUID: communityUUID,
		}

		fmt.Println("hogehoeghegohgoe")
		fmt.Println(scoutDetail.User_UUID)

		if err := h.scoutUsecase.Create(ctx.Request.Context(), scoutDetail); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.Status(http.StatusCreated)
}

func (h *ScoutHandler) GetMessageUser(ctx *gin.Context) {
	var req struct {
		IsUser bool   `json:"isUser"`
		UUID   string `json:"uuid"`
	}

	if err := json.NewDecoder(ctx.Request.Body).Decode(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Failed to decode request body"})
		return
	}

	uuidParsed, err := uuid.Parse(req.UUID)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var result []interface{}

	if req.IsUser {
		users, err := h.scoutUsecase.GetUsersWithStatus(ctx.Request.Context(), uuidParsed, 3)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		for _, user := range users {
			result = append(result, map[string]interface{}{
				"uuid": user.UserUUID,
				"name": user.Name,
				"img":  user.Img,
			})
		}
	} else {
		communities, err := h.scoutUsecase.GetCommunitiesWithStatus(ctx.Request.Context(), uuidParsed, 3)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		for _, community := range communities {
			result = append(result, map[string]interface{}{
				"uuid": community.CommunityUUID,
				"name": community.Name,
				"img":  community.Img,
			})
		}
	}

	ctx.JSON(http.StatusOK, result)
}
