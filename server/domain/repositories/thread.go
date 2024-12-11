package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IThreadRepository interface {
	FindByUUID(ctx context.Context, uuid string) (*models.Thread, error)
	Create(ctx context.Context, thread *models.Thread) (*models.Thread, error)
	FindByUserUUID(ctx context.Context, threadID string) (*models.Thread, error)
}
