package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type ITagRepository interface {
	Create(ctx context.Context, tag *models.Tag) (int, error)
	GetRandomTags(ctx context.Context, limit int) ([]*models.Tag, error)
}
