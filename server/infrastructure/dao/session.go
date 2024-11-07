package dao

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type sessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *sessionRepository {
	return &sessionRepository{db: db}
}

func (r *sessionRepository) Create(ctx context.Context, session *models.Session) error {
	return r.db.WithContext(ctx).Create(session).Error
}

func (r *sessionRepository) Get(ctx context.Context, sessionKye string) (string, error) {
	var session *models.Session
	if err := r.db.WithContext(ctx).Where("session_key = ?", sessionKye).Find(&session).Error; err != nil {
		return "", err
	}
	return session.User_UUID, nil
}
