package dao

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) *tagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(ctx context.Context, tag *models.Tag) error {
	return r.db.WithContext(ctx).Create(tag).Error
}

func (r *tagRepository) GetRandomTags(ctx context.Context, limit int) ([]*models.Tag, error) {
	var tags []*models.Tag
	if err := r.db.WithContext(ctx).Order("RAND()").Limit(limit).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}
