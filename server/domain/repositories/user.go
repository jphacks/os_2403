package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IUserRepository interface {
	Create(ctx context.Context, user *models.User) error
	FindByEmail(ctx context.Context, email string) (*models.User, error)
}