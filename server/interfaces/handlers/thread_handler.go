package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jphacks/os_2403/infrastructure/middleware"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
)

type (
	CreateTagClickHistoryRequest = usecase.CreateTagClickHistoryInput
)

type IThreadHandler interface {
	CreateThread(ctx *gin.Context)
	ThreadMessage(ctx *gin.Context)
}

type threadHandler struct {
	threadUsecase          usecase.IThreadUsecase
	tagUsecase             usecase.ITagUsecase
	tagClickHistoryUsecase usecase.ITagClickHistoryUsecase
	upgrader               websocket.Upgrader
	wsService              *middleware.WebSocketService
}

func NewThreadHandler(threadUsecase usecase.IThreadUsecase, wsService *middleware.WebSocketService, tagUsecase usecase.ITagUsecase, tagClickHistoryUsecase usecase.ITagClickHistoryUsecase) IThreadHandler {
	return &threadHandler{
		threadUsecase:          threadUsecase,
		tagUsecase:             tagUsecase,
		tagClickHistoryUsecase: tagClickHistoryUsecase,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // 本番環境では適切な設定が必要
			},
		},
		wsService: wsService,
	}
}

func (h *threadHandler) CreateThread(ctx *gin.Context) {
	userUUID := ctx.Query("user_uuid")
	// 全てのタグの取得
	tags, err := h.tagUsecase.GetAll(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// スレッド作成の関数呼び出し
	threadID, err := h.threadUsecase.CreateThread(ctx, userUUID, tags)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// レスポンスでIDだけ返す
	ctx.JSON(http.StatusOK, gin.H{"thread_id": &threadID})
}

func (h *threadHandler) ThreadMessage(ctx *gin.Context) {
	uuid := ctx.Param("uuid")

	tags, err := h.tagUsecase.GetAll(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user, err := h.threadUsecase.FindByUserUUID(ctx, uuid)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("user: %+v\n", user)

	conn, err := h.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	h.wsService.AddClient(uuid, conn)
	defer h.wsService.RemoveClient(uuid, conn)

	for {
		var msgData struct {
			Tag string `json:"tag"`
		}

		err := conn.ReadJSON(&msgData)
		if err != nil {
			fmt.Println("Error reading JSON:", err)
			break
		}

		err = h.tagClickHistoryUsecase.Create(ctx, CreateTagClickHistoryRequest{
			UserUUID: user.UserUUID,
			TagName:  msgData.Tag,
			Action:   "click",
		})
		if err != nil {
			fmt.Println("Error create tagClickHistory:", err)
			break
		}

		gpttags, err := h.threadUsecase.ThreadMessage(ctx, user.ThreadID, uuid, msgData.Tag, tags)
		if err != nil {
			fmt.Println("Error handling message:", err)
			break
		}

		for _, tag := range gpttags {
			err = h.tagClickHistoryUsecase.Create(ctx, CreateTagClickHistoryRequest{
				UserUUID: user.UserUUID,
				TagName:  tag,
				Action:   "gpt",
			})
			if err != nil {
				fmt.Println("Error create tagClickHistory:", err)
				break
			}
		}
	}
}
