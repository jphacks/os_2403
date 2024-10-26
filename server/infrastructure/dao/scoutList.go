package dao

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type scoutListRepository struct {
	db *gorm.DB
}

func NewScoutListRepository(db *gorm.DB) *scoutListRepository {
	return &scoutListRepository{db: db}
}

func (r *scoutListRepository) Create(ctx context.Context, scoutList *models.ScoutDetailList) error {
	scoutListModel := &models.ScoutList{
		User_UUID:      scoutList.User_UUID,
		Status:         scoutList.Status,
		Community_UUID: scoutList.Community_UUID,
	}
	return r.db.WithContext(ctx).Create(scoutListModel).Error
}

func (r *scoutListRepository) Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error) {
	var scoutLists []models.ScoutList
	if err := r.db.WithContext(ctx).Where("user_uuid = ?", userUUID).Find(&scoutLists).Error; err != nil {
		return nil, err
	}

	var responses []models.ScoutListResponse
	for _, scout := range scoutLists {
		responses = append(responses, models.ScoutListResponse{
			ID:             scout.ID,
			Status:         scout.Status,
			Community_UUID: scout.Community_UUID,
		})
	}
	return responses, nil
}

func (r *scoutListRepository) ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error {
	return r.db.WithContext(ctx).Model(&models.ScoutList{}).
		Where("user_uuid = ?", userUUID).
		Update("status", status).Error
}

func (r *scoutListRepository) GetByCommunityUUID(ctx context.Context, communityUUID uuid.UUID) (*models.ScoutList, error) {
	var scoutList models.ScoutList
	if err := r.db.WithContext(ctx).Where("community_uuid = ?", communityUUID).First(&scoutList).Error; err != nil {
		return nil, err
	}
	return &scoutList, nil
}
