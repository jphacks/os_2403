package repositories

import "github.com/jphacks/os_2403/domain/models"

type MessageRepository interface {
	Save(message *models.Message) error
	FindByRoomID(roomID string) ([]*models.Message, error)
}
