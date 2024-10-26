package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type icommunityHandler struct {
	communityUsecase usecase.ICommunityUsecase
}

type ICommunityHandler interface {
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

func (h *icommunityHandler) Update(ctx *gin.Context) {
	var request CommunityUpdateRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Updateメソッドを呼び出す
	if err := h.communityUsecase.Update(ctx, request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful"})
}
