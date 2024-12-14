package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type ITagClickHistory interface {
	Create(ctx context.Context, tagClickHistory *models.TagClickHistory) error
}
