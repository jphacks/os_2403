package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jphacks/os_2403/domain/models"
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
	err, id := h.threadUsecase.CreateThread(ctx, userUUID, tags)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	// レスポンスでIDだけ返す
	ctx.JSON(http.StatusOK, gin.H{"thread_id": string(id)})
}

func (h *threadHandler) ThreadMessage(ctx *gin.Context) {
	id := ctx.Query("thread_id")

	conn, err := h.upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	//WebSocketサービスにクライアントを追加
	h.wsService.AddClient(id, conn)
	defer h.wsService.RemoveClient(id, conn)

	for {
		// メッセージ内容を取り出すための構造体
		var msgData struct {
			UserUUID string `json:"user_uuid"`
			tag      string `json:"tag"`
		}

		err := h.tagClickHistoryUsecase.Create(ctx, CreateTagClickHistoryRequest{
			UserUUID: msgData.UserUUID,
			TagName:  msgData.tag,
			Action:   "click",
		})
		if err != nil {
			fmt.Println("Error create tagClickHistory:", err)
			break
		}

		// WebSocketで受信したメッセージをJSONとして読み取り
		err = conn.ReadJSON(&msgData)
		if err != nil {
			fmt.Println("Error reading JSON:", err)
			break
		}

		fmt.Printf("msgData: %+v\n", msgData)

		// メッセージの処理GPT呼び出し(tagにはNameのstringのみ入ってる)
		// &models.Tags{}に入れるデータを返してほしい、GPTからIDだけが帰ってくるならTagのFindByIDするなりして

		if err := h.threadUsecase.ThreadMessage(ctx, id, &models.Tags{
			{ID: 1, Name: "Tag1", Color: "blue"},
			{ID: 2, Name: "Tag2", Color: "green"},
			{ID: 3, Name: "Tag3", Color: "red"},
		}); err != nil {
			fmt.Println("Error handling message:", err)
			break
		}
		// メッセージとして送ったもの以外もAction：gptとして一個ずつ保存する
		//err := h.tagClickHistoryUsecase.Create(ctx, CreateTagClickHistoryRequest{
		//			UserUUID: msgData.UserUUID,
		//			TagName:  msgData.tag,
		//			Action:   "gpt",
		//		})
	}

}
