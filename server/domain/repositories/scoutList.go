package repositories

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
)

type IScoutListRepository interface {
	GetByCommunityUUID(ctx context.Context, communityUUID string) ([]models.ScoutList, error)
	GetByUserUUID(ctx context.Context, userUUID string) ([]models.ScoutList, error)
	Create(ctx context.Context, scoutList *models.ScoutList) error
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetUsersWithStatus(ctx context.Context, communityUUID uuid.UUID, status uint) ([]models.MessageUser, error)
	GetCommunitiesWithStatus(ctx context.Context, userUUID uuid.UUID, status uint) ([]models.MessageCommunity, error)
}
