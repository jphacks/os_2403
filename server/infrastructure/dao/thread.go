package dao

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type threadRepository struct {
	db *gorm.DB
}

func NewThreadRepository(db *gorm.DB) *threadRepository {
	return &threadRepository{db: db}
}

func (r *threadRepository) Create(ctx context.Context, thread *models.Thread) (*models.Thread, error) {
	if err := r.db.WithContext(ctx).Create(thread).Error; err != nil {
		return nil, err // 作成に失敗した場合は、nilとエラーを返す
	}
	return thread, nil
}

func (r *threadRepository) FindByUUID(ctx context.Context, uuid string) (*models.Thread, error) {
	var thread models.Thread
	if err := r.db.WithContext(ctx).First(&thread, "user_id = ?", uuid).Error; err != nil {
		return nil, err
	}
	return &thread, nil
}

func (r *threadRepository) FindByUserUUID(ctx context.Context, threadID string) (*models.Thread, error) {
	var thread models.Thread
	if err := r.db.WithContext(ctx).First(&thread, "user_uuid = ?", threadID).Error; err != nil {
		return nil, err
	}
	return &thread, nil
}
