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
	GetUserDetailByScoutList(ctx *gin.Context)
	CreateScouts(ctx *gin.Context)
	ChangeStatus(ctx *gin.Context)
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
	userUUID := ctx.Query("user_uuid")

	scoutlist, err := h.scoutUsecase.GetWithCommunityDetails(ctx.Request.Context(), userUUID)
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

	// TODO: クエリパラメータでCommunity_UUIDを受け取り，TagではなくUser_UUID[]を受け取るように変更，POSTにしてリクエストボディ

	// "content" : "honnbunn",
	// "community_uuid" : "b1b4b3b4-1b3b-4b3b-4b3b-4b3b4b3b4b3b",
	// "uuids" : {
	//				"user_uuid":"b1b4b3b4-1b3b-4b3b-4b3b-4b3b4b3b4b3b",
	//           },
	//           {
	//          	"user_uuid":"b1b4b3b4-1b3b-4b3b-4b3b-4b3b4b3b4b3b",
	//           },

	// uuids っていうstring[]を作って，uuidsとcommnuity_uuidとcontentをUsecaseに渡す，Usecaseでなんとかする
	// UsecaseではuuidsをUserのリスト(name,email)にする．
	// それを元にScoutListを作成する, それをDBに保存する，メール送信

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
			Status:         0, // 最初は未承認(0)で登録
			Community_UUID: communityUUID,
		}

		if err := h.scoutUsecase.Create(ctx.Request.Context(), scoutDetail); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ctx.Status(http.StatusCreated)
}
