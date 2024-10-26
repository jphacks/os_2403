package dao

import (
	"context"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type communityRepository struct {
	db *gorm.DB
}

func NewCommunityRepository(db *gorm.DB) *communityRepository {
	return &communityRepository{db: db}
}

func (r *communityRepository) Create(ctx context.Context, user *models.Community) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *communityRepository) FindByEmail(ctx context.Context, email string) (*models.Community, error) {
	var community *models.Community
	fmt.Println(email)
	if err := r.db.WithContext(ctx).Where("email = ?", email).Find(&community).Error; err != nil {
		fmt.Println("err")
		return nil, err
	}
	return community, nil
}
