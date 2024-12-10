package dao

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type scoutListRepository struct {
	db *gorm.DB
}

func NewscoutListRepository(db *gorm.DB) *scoutListRepository {
	return &scoutListRepository{db: db}
}

func (r *scoutListRepository) GetByCommunityUUID(ctx context.Context, communityUUID string) ([]models.ScoutList, error) {
	var scoutlist []models.ScoutList
	parsedUUID, err := uuid.Parse(communityUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid UUID format: %v", err)
	}

	db := r.db.WithContext(ctx).Debug()
	result := db.Where("community_uuid = ?", parsedUUID).Find(&scoutlist)

	if result.Error != nil {
		return nil, result.Error
	}

	return scoutlist, nil
}

func (r *scoutListRepository) GetByUserUUID(ctx context.Context, userUUID string) ([]models.ScoutList, error) {
	var scoutlist []models.ScoutList

	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid UUID format: %v", err)
	}

	err = r.db.WithContext(ctx).Where("user_uuid = ?", parsedUUID).Find(&scoutlist).Error
	if err != nil {
		return nil, err
	}

	return scoutlist, nil
}

func (r *scoutListRepository) Create(ctx context.Context, scoutList *models.ScoutList) error {
	return r.db.WithContext(ctx).Create(scoutList).Error
}

func (r *scoutListRepository) ChangeStatus(ctx context.Context, ID uint, status models.ScoutStatus) error {
	return r.db.WithContext(ctx).
		Model(&models.ScoutList{}).
		Where("id = ?", ID).
		Update("status", status).Error
}

func (r *scoutListRepository) FindByID(ctx context.Context, ID uint) (*models.ScoutList, error) {
	var scoutlist models.ScoutList

	err := r.db.WithContext(ctx).Where("id = ?", ID).First(&scoutlist).Error
	if err != nil {
		return nil, err
	}

	return &scoutlist, nil
}
