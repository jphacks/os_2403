package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
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
	var err error
	request.UUID, err = uuid.Parse(ctx.Param("uuid"))
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
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

	request.UUID = ctx.Param("uuid")

	fmt.Println(request)

	user, err := h.userUsecase.FindByID(ctx, request)

	res := gin.H{
		"uuid":  user.UUID,
		"name":  user.Name,
		"email": user.Email,
		"img":   user.Img,
		"self":  user.Self,
		"mem1":  user.Mem1,
		"mem2":  user.Mem2,
		"mem3":  user.Mem3,
		"tags":  user.Tags,
	}

	if err != nil {
		fmt.Errorf("failed to get user: %w", err)
		return
	}

	ctx.JSON(http.StatusOK, res)
}
