package usecase

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type IScoutListUsecase interface {
	Create(ctx context.Context, scoutList *models.ScoutList) error
	Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetWithCommunityDetails(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
}

type scoutListUsecase struct {
	scoutListRepo repositories.IScoutListRepository
}

func NewScoutListUsecase(repo repositories.IScoutListRepository) IScoutListUsecase {
	return &scoutListUsecase{
		scoutListRepo: repo,
	}
}

func (u *scoutListUsecase) Create(ctx context.Context, scoutDetailList *models.ScoutList) error {
	return u.scoutListRepo.Create(ctx, scoutDetailList)
}

func (u *scoutListUsecase) Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error) {
	return u.scoutListRepo.Get(ctx, userUUID)
}

func (u *scoutListUsecase) ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error {
	return u.scoutListRepo.ChangeStatus(ctx, userUUID, status)
}

func (u *scoutListUsecase) GetWithCommunityDetails(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error) {
	return u.scoutListRepo.GetWithCommunityDetails(ctx, userUUID)
}
