package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type userHandler struct {
	userUsecase usecase.IUesrUsecase
}

type IUserHandler interface {
	Update(ctx *gin.Context)
	FindByID(ctx *gin.Context)
}

type (
	UserUpdateRequest   = usecase.InputUserUpdate
	UserFindByIDRequest = usecase.InputUserFindByID
)

func NewUserHandler(userUsecase usecase.IUesrUsecase) IUserHandler {
	return &userHandler{
		userUsecase: userUsecase,
	}
}

func (h *userHandler) Update(ctx *gin.Context) {
	var request UserUpdateRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Updateメソッドを呼び出す
	if err := h.userUsecase.Update(ctx, request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful"})
}

func (h *userHandler) FindByID(ctx *gin.Context) {
	var request UserFindByIDRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(request)

	user, err := h.userUsecase.FindByID(ctx, request)

	if err != nil {
		fmt.Errorf("failed to get user: %w", err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "login in successful", "user": user})
}
