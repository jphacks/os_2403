package repositories

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
)

type IScoutListRepository interface {
	Create(ctx context.Context, scoutList *models.ScoutDetailList) error
	Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
	GetWithCommunityDetails(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetByCommunityUUID(ctx context.Context, communityUUID uuid.UUID) (*models.ScoutList, error)
}
