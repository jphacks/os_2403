package dao

import (
	"context"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *userRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *userRepository) Update(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).
		Model(&models.User{UUID: user.UUID}). // モデル全体を指定
		Where("uuid = ?", user.UUID). // 特定のユーザーを指定
		Updates(user).Error
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	var user *models.User
	fmt.Println(email)

	if err := r.db.WithContext(ctx).Where("email = ?", email).Find(&user).Error; err != nil {
		fmt.Println("err")
		return nil, err
	}
	return user, nil
}
