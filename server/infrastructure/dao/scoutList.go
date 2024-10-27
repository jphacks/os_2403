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

func NewscoutListRepository(db *gorm.DB) *scoutListRepository {
	return &scoutListRepository{db: db}
}

func (r *scoutListRepository) Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error) {
	var scoutLists []models.ScoutList

	// Update query to include Community relationship
	if err := r.db.WithContext(ctx).
		Preload("Community"). // Preload community data
		Where("user_uuid = ?", userUUID).
		Find(&scoutLists).Error; err != nil {
		return nil, err
	}

	var responses []models.ScoutListResponse
	for _, scout := range scoutLists {
		responses = append(responses, models.ScoutListResponse{
			ID:             scout.ID,
			Status:         scout.Status,
			Community_UUID: scout.Community_UUID,
			CommunityInfo: models.CommunityInfo{
				Name: scout.Community.Name,
				Img:  scout.Community.Img,
				Self: scout.Community.Self,
				Mem1: scout.Community.Mem1,
				Mem2: scout.Community.Mem2,
				Mem3: scout.Community.Mem3,
				Tags: scout.Community.Tags,
			},
		})
	}
	return responses, nil
}

// Add new method to get scout list with detailed community information
func (r *scoutListRepository) GetWithCommunityDetails(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error) {
	var results []struct {
		models.ScoutList
		CommunityName string `gorm:"column:community_name"`
		CommunityImg  string `gorm:"column:community_img"`
		CommunitySelf string `gorm:"column:community_self"`
		CommunityMem1 uint   `gorm:"column:community_mem1"`
		CommunityMem2 uint   `gorm:"column:community_mem2"`
		CommunityMem3 uint   `gorm:"column:community_mem3"`
		CommunityTags []int  `gorm:"column:community_tags"`
	}

	query := r.db.WithContext(ctx).
		Table("scout_lists").
		Select("scout_lists.*, "+
			"communities.name AS community_name, "+
			"communities.img as community_img, "+
			"communities.self as community_self, "+
			"communities.mem1 as community_mem1, "+
			"communities.mem2 as community_mem2, "+
			"communities.mem3 as community_mem3, "+
			"communities.tags as community_tags").
		Joins("LEFT JOIN communities ON scout_lists.community_uuid = communities.uuid").
		Where("scout_lists.user_uuid = ?", userUUID)

	if err := query.Find(&results).Error; err != nil {
		return nil, err
	}

	var responses []models.ScoutListResponse
	for _, result := range results {
		responses = append(responses, models.ScoutListResponse{
			Status:         result.Status,
			Community_UUID: result.Community_UUID,
			CommunityInfo: models.CommunityInfo{
				Name: result.CommunityName,
				Img:  result.CommunityImg,
				Self: result.CommunitySelf,
				Mem1: result.CommunityMem1,
				Mem2: result.CommunityMem2,
				Mem3: result.CommunityMem3,
				Tags: result.CommunityTags,
			},
		})
	}

	return responses, nil
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
