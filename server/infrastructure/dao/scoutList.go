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

func (r *scoutListRepository) ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error {
	return r.db.WithContext(ctx).
		Model(&models.ScoutList{}).
		Where("user_uuid = ?", userUUID).
		Update("status", status).Error
}

func (r *scoutListRepository) GetUsersWithStatus(ctx context.Context, communityUUID uuid.UUID, status uint) ([]models.MessageUser, error) {
	var users []models.MessageUser

	query := r.db.WithContext(ctx).
		Table("scout_lists").
		Select("scout_lists.user_uuid, users.name, users.img").
		Joins("JOIN users ON scout_lists.user_uuid = users.uuid").
		Where("scout_lists.community_uuid = ? AND scout_lists.status = ?", communityUUID, status)

	if err := query.Scan(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (r *scoutListRepository) GetCommunitiesWithStatus(ctx context.Context, userUUID uuid.UUID, status uint) ([]models.MessageCommunity, error) {
	var communities []models.MessageCommunity

	query := r.db.WithContext(ctx).
		Table("scout_lists").
		Select("scout_lists.community_uuid, communities.name, communities.img").
		Joins("JOIN communities ON scout_lists.community_uuid = communities.uuid").
		Where("scout_lists.user_uuid = ? AND scout_lists.status = ?", userUUID, status)

	if err := query.Scan(&communities).Error; err != nil {
		return nil, err
	}

	return communities, nil
}
