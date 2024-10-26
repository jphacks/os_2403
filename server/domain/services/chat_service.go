package services

import (
	"github.com/gorilla/websocket"
	"github.com/jphacks/os_2403/domain/models"
)

type ChatService interface {
	BroadcastMessage(message *models.Message) error
	HandleConnection(userID string, conn *websocket.Conn)
}
