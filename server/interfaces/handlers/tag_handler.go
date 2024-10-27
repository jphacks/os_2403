package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type tagHandler struct {
	tagUsecase usecase.ITagUsecase
}

type ITagHandler interface {
	GetRandom(ctx *gin.Context)
}

type (
	TagUpdateRequest = usecase.InputUserUpdate
)

func NewTagHandler(tagUsecase usecase.ITagUsecase) ITagHandler {
	return &tagHandler{
		tagUsecase: tagUsecase,
	}
}

func (h *tagHandler) GetRandom(ctx *gin.Context) {
	//
	tags, err := h.tagUsecase.GetRandom(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful", "tags": tags})
}
