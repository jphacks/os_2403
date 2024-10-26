package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IEventRepository interface {
	GetAllEvents(ctx context.Context) ([]models.Event, error)
	Create(ctx context.Context, event *models.Event) error
	Update(ctx context.Context, event *models.Event) error
}
