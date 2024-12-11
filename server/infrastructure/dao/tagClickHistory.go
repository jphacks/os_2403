package dao

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type TagClickHistoryRepository struct {
	db *gorm.DB
}

func NewTagClickHistory(db *gorm.DB) *TagClickHistoryRepository {
	return &TagClickHistoryRepository{
		db: db,
	}
}

func (r *TagClickHistoryRepository) Create(ctx context.Context, tagClickHistory *models.TagClickHistory) error {
	return r.db.WithContext(ctx).Create(tagClickHistory).Error
}
