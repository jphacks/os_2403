package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type authUserHandler struct {
	authUsecase     usecase.IAuthUsecase
	sessionsUsecase usecase.IAuthUsecase
	store           *sessions.CookieStore
}

type IAuthHandler interface {
	SignUp(ctx *gin.Context)
	SignIn(ctx *gin.Context)
	SignOut(ctx *gin.Context)
	CheckSession(ctx *gin.Context)
}

type (
	SignUpRequest = usecase.InputSignUp
	SignInRequest = usecase.InputSignIn
)

func NewAuthUserHandler(authUsecase usecase.IAuthUsecase, store *sessions.CookieStore) IAuthHandler {
	return &authUserHandler{
		authUsecase: authUsecase,
		store:       store,
	}
}

func (h *authUserHandler) SignUp(ctx *gin.Context) {
	var request SignUpRequest
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

	ctx.JSON(http.StatusCreated, gin.H{"message": "sign in successful"})
}

func (h *authUserHandler) SignIn(ctx *gin.Context) {
	var request SignInRequest
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

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

func (h *authUserHandler) SignOut(ctx *gin.Context) {
	fmt.Println("logoutHandler")
	// セッションを取得
	session, err := h.store.Get(ctx.Request, "session-name")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
		return
	}

	// セッションの値をクリア
	session.Values = make(map[interface{}]interface{})

	// セッションの有効期限を0に設定して、すぐに無効化
	session.Options.MaxAge = -1

	// セッションを保存（これで削除が確定する）
	if err := session.Save(ctx.Request, ctx.Writer); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear session"})
		return
	}

	fmt.Printf("logout: %v\n", session.Values) // フォーマットを修正
}

func (h *authUserHandler) CheckSession(c *gin.Context) {
	fmt.Println("check session request")
	fmt.Println(c.Request)
	session, err := h.store.Get(c.Request, "session-name")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Session error"})
		return
	}

	fmt.Printf("session: %+v\\n", session)
	fmt.Printf("session.Values keys: %+v\\n", session.Values["user_id"])

	if auth, ok := session.Values["user_id"].(uuid.UUID); !ok || auth.String() == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// ユーザー情報をレスポンスとして返す
	response := map[string]interface{}{
		"user_id":      session.Values["user_id"],
		"account_type": session.Values["account_type"],
		"status":       "authenticated",
	}

	fmt.Println("respons: %+v\n", response)

	c.JSON(http.StatusOK, response)
}
