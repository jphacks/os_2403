package dao

import (
	"context"
	"errors"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) *tagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(ctx context.Context, tag *models.Tag) (int, error) {
	// 同じメンバーが既に存在するかを確認
	fmt.Println(tag.Name)
	var existingTag models.Tag
	if err := r.db.WithContext(ctx).Where("name = ?", tag.Name).First(&existingTag).Error; err == nil {
		// 既に存在する場合は、そのIDを返す
		return int(existingTag.ID), nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// その他のエラーが発生した場合
		return 0, err
	}

	// 同じメンバーが存在しない場合は新たに作成
	if err := r.db.WithContext(ctx).Create(tag).Error; err != nil {
		return 0, err // 作成に失敗した場合は、0とエラーを返す
	}
	return int(tag.ID), nil // 作成されたメンバーのIDを返す
}

func (r *tagRepository) GetRandomTags(ctx context.Context, limit int) ([]*models.Tag, error) {
	var tags []*models.Tag
	if err := r.db.WithContext(ctx).Order("RAND()").Limit(limit).Find(&tags).Error; err != nil {
		return nil, err
	}
	return tags, nil
}
