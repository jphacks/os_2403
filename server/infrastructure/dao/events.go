package dao

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type eventRepository struct {
	db *gorm.DB
}

func NewEventRepository(db *gorm.DB) *eventRepository {
	return &eventRepository{db: db}
}

func (r *eventRepository) GetAllEvents(ctx context.Context) ([]models.Event, error) {
	var events []models.Event
	if err := r.db.WithContext(ctx).Order("created_at desc").Find(&events).Error; err != nil {
		return nil, err
	}
	return events, nil
}

func (r *eventRepository) Create(ctx context.Context, event *models.Event) error {
	return r.db.WithContext(ctx).Create(event).Error
}

func (r *eventRepository) Update(ctx context.Context, event *models.Event) error {
	return r.db.WithContext(ctx).Model(&models.Event{}).Where("id = ?", event.ID).Updates(event).Error
}
