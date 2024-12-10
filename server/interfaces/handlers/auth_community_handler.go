package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/sessions"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type communityHandler struct {
	authUsecase     usecase.IAuthCommunityUsecase
	sessionsUsecase usecase.IAuthCommunityUsecase
	store           *sessions.CookieStore
}

type IAuthCommunityHandler interface {
	SignUp(ctx *gin.Context)
	SignIn(ctx *gin.Context)
}

type (
	SignInCommunityRequest = usecase.InputCommunitySignUp
	LoginCommunityRequest  = usecase.InputCommunitySignIn
)

func NewAuthCommunityHandler(authUsecase usecase.IAuthCommunityUsecase, store *sessions.CookieStore) IAuthCommunityHandler {
	return &communityHandler{
		authUsecase: authUsecase,
		store:       store,
	}
}

func (h *communityHandler) SignUp(ctx *gin.Context) {
	var request SignInCommunityRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// SignInメソッドを呼び出す
	uuid, err := h.authUsecase.SignUp(ctx, request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// セッションの取得
	session, err := h.store.Get(ctx.Request, "session-name")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
		return
	}

	session.Values["user_id"] = uuid // ユーザーIDを保存
	session.Values["account_type"] = "community"
	// セッションの設定を調整
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600 * 24, // セッションの有効期限（適宜調整）
		HttpOnly: true,
		Secure:   true, // HTTPSが有効な環境で使用
		SameSite: http.SameSiteNoneMode,
	}

	if err := session.Save(ctx.Request, ctx.Writer); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "sign in successful"})
}

func (h *communityHandler) SignIn(ctx *gin.Context) {
	var request LoginCommunityRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// SignInメソッドを呼び出す
	uuid, err := h.authUsecase.SignIn(ctx, request)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// セッションの取得
	session, err := h.store.Get(ctx.Request, "session-name")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
		return
	}

	session.Values["user_id"] = uuid // ユーザーIDを保存
	session.Values["account_type"] = "user"
	// セッションの設定を調整
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600 * 24, // セッションの有効期限（適宜調整）
		HttpOnly: true,
		Secure:   true, // HTTPSが有効な環境で使用
		SameSite: http.SameSiteNoneMode,
	}

	if err := session.Save(ctx.Request, ctx.Writer); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save session"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "login in successful", "uuid": uuid})
}
