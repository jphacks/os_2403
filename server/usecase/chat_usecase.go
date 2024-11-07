package usecase

import (
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"github.com/jphacks/os_2403/infrastructure/middleware"
)

type ChatUseCase struct {
	messageRepo repositories.MessageRepository
	wsService   *middleware.WebSocketService
}

func NewChatUseCase(messageRepo repositories.MessageRepository, wsService *middleware.WebSocketService) *ChatUseCase {
	return &ChatUseCase{
		messageRepo: messageRepo,
		wsService:   wsService,
	}
}

func (u *ChatUseCase) HandleMessage(message *models.Message) error {
	if err := u.messageRepo.Save(message); err != nil {
		return err
	}
	u.wsService.BroadcastToRoom(message.RoomID, message)
	return nil
}

func (u *ChatUseCase) GetMessages(roomID string) ([]*models.Message, error) {
	return u.messageRepo.FindByRoomID(roomID)
}
