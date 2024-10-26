package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/infrastructure/middleware"
	"github.com/jphacks/os_2403/usecase"
	"net/http"
	"strconv"
)

type ChatHandler struct {
	useCase   *usecase.ChatUseCase
	upgrader  websocket.Upgrader
	wsService *middleware.WebSocketService
}

func NewChatHandler(useCase *usecase.ChatUseCase, wsService *middleware.WebSocketService) *ChatHandler {
	return &ChatHandler{
		useCase: useCase,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // 本番環境では適切な設定が必要
			},
		},
		wsService: wsService,
	}
}

func (h *ChatHandler) HandleWebSocket(c *gin.Context) {
	roomID := c.Param("room_id")
	userID := c.Param("messagefrom")
	fmt.Println("request")
	fmt.Println(roomID)
	fmt.Println(userID)

	// roomIDをintに変換
	intRoomID, err := strconv.Atoi(roomID)
	if err != nil {
		// エラーハンドリング
		fmt.Println("Invalid room_id:", err)
		return
	}

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	//WebSocketサービスにクライアントを追加
	h.wsService.AddClient(roomID, conn)
	defer h.wsService.RemoveClient(roomID, conn)

	for {
		// メッセージ内容を取り出すための構造体
		var msgData struct {
			Content     string `json:"content"`
			MessageFrom string `json:"messagefrom"`
			UserID      string `json:"user_id"`
		}

		// WebSocketで受信したメッセージをJSONとして読み取り
		err := conn.ReadJSON(&msgData)
		if err != nil {
			fmt.Println("Error reading JSON:", err)
			break
		}

		// Message構造体に値を割り当て
		msg := models.Message{
			RoomID:  intRoomID,
			Message: msgData.Content,
			UserID:  msgData.UserID,
			Looked:  0,
		}

		// メッセージの処理
		if err := h.useCase.HandleMessage(&msg); err != nil {
			fmt.Println("Error handling message:", err)
			break
		}
	}
}

func (h *ChatHandler) GetMessages(c *gin.Context) {
	roomID := c.Param("room_id")
	messages, err := h.useCase.GetMessages(roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}
