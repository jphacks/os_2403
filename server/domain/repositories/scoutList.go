package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IScoutListRepository interface {
	GetByCommunityUUID(ctx context.Context, communityUUID string) ([]models.ScoutList, error)
	GetByUserUUID(ctx context.Context, userUUID string) ([]models.ScoutList, error)
	Create(ctx context.Context, scoutList *models.ScoutList) error
	ChangeStatus(ctx context.Context, ID uint, status models.ScoutStatus) error
	FindByID(ctx context.Context, ID uint) (*models.ScoutList, error)
}
