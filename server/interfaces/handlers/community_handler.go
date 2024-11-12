package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type icommunityHandler struct {
	communityUsecase usecase.ICommunityUsecase
}

type ICommunityHandler interface {
	FindById(ctx *gin.Context)
	Update(ctx *gin.Context)
}

type (
	CommunityUpdateRequest = usecase.InputCommunityUpdate
)

func NewCommunityHandler(userUsecase usecase.ICommunityUsecase) ICommunityHandler {
	return &icommunityHandler{
		communityUsecase: userUsecase,
	}
}

func (h *icommunityHandler) FindById(ctx *gin.Context) {
	var request usecase.InputCommunityFindByID
	var err error
	request.UUID, err = uuid.Parse(ctx.Param("uuid"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	community, err := h.communityUsecase.FindByID(ctx, request)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, community)

}

func (h *icommunityHandler) Update(ctx *gin.Context) {
	var request CommunityUpdateRequest
	var err error
	request.UUID, err = uuid.Parse(ctx.Param("uuid"))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Updateメソッドを呼び出す
	if err := h.communityUsecase.Update(ctx, request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful"})
}
