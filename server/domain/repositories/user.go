package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IUserRepository interface {
	Create(ctx context.Context, user *models.User) error
	Update(ctx context.Context, user *models.User) error
	FindByEmail(ctx context.Context, email string) (*models.User, error)
	FindByID(ctx context.Context, uuid string) (*models.User, error)
	FindByTag(ctx context.Context, tag int) ([]*models.User, error)
}
