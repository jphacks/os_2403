package dao

import (
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type MessageRepository struct {
	db *gorm.DB
}

func NewMessageRepository(db *gorm.DB) *MessageRepository {
	return &MessageRepository{db: db}
}

func (r *MessageRepository) Save(message *models.Message) error {
	return r.db.Create(message).Error
}

func (r *MessageRepository) FindByRoomID(roomID string) ([]*models.Message, error) {
	var messages []*models.Message
	err := r.db.Where("room_id = ?", roomID).Order("created_at desc").Limit(50).Find(&messages).Error
	return messages, err
}
