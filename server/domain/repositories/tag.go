package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type ITagRepository interface {
	Create(ctx context.Context, tag *models.Tag) (int, error)
	FindTagByID(ctx context.Context, tagID int) (*models.Tag, error)
	GetRandomTags(ctx context.Context, limit int) ([]*models.Tag, error)
	GetAll(ctx context.Context) ([]*models.Tag, error)
}
