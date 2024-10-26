package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type userHandler struct {
	authUsecase     usecase.IAuthUsecase
	sessionsUsecase usecase.IAuthUsecase
	store           *sessions.CookieStore
}

type IAuthHandler interface {
	SignIn(ctx *gin.Context)
	Login(ctx *gin.Context)
}

type (
	SignInRequest = usecase.InputSignIn
	LoginRequest  = usecase.InputLogin
)

func NewUserHandler(authUsecase usecase.IAuthUsecase, store *sessions.CookieStore) IAuthHandler {
	return &userHandler{
		authUsecase: authUsecase,
		store:       store,
	}
}

func (h *userHandler) SignIn(ctx *gin.Context) {
	var request SignInRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// SignInメソッドを呼び出す
	if err := h.authUsecase.SignIn(ctx, request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//// セッションの取得
	//session, err := h.store.Get(ctx.Request, "session-name")
	//if err != nil {
	//	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
	//	return
	//}
	//
	//// セッションの設定を調整
	//session.Options = &sessions.Options{
	//	Path:     "/",
	//	MaxAge:   100 * 1, // セッションの有効期限（適宜調整）
	//	HttpOnly: true,
	//	Secure:   true, // HTTPSが有効な環境で使用
	//	SameSite: http.SameSiteNoneMode,
	//}

	//if err := session.Save(ctx.Request, ctx.Writer); err != nil {
	//	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
	//	return
	//}

	//h.sessionsUsecase.SignIn(ctx, )

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful"})
}

func (h *userHandler) Login(ctx *gin.Context) {
	var request LoginRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// SignInメソッドを呼び出す
	if err := h.authUsecase.Login(ctx, request); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "login in successful"})
}
