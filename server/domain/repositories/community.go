package repositories

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
)

type ICommunityRepository interface {
	Create(ctx context.Context, community *models.Community) error
	Update(ctx context.Context, community *models.Community) error
	FindByEmail(ctx context.Context, email string) (*models.Community, error)
	FindByID(ctx context.Context, uuid uuid.UUID) (*models.Community, error)
}
