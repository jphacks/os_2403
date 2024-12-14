package usecase

import (
	"context"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"github.com/jphacks/os_2403/infrastructure/mail"
	"log"
)

type IScoutListUsecase interface {
	Create(ctx context.Context, scoutList *models.ScoutList, context string) error
	ChangeStatus(ctx context.Context, id uint, status models.ScoutStatus) error
	GetWithCommunityDetails(ctx context.Context, userUUID string) ([]models.ScoutListResponse, error)
	GetCommunityDetailsWithScoutLists(ctx context.Context, userUUID string) ([]models.ScoutListResponse, error)
	GetWithUserDetail(ctx context.Context, communityUUID string) ([]models.ScoutListResponse, error)
}

type scoutListUsecase struct {
	scoutListRepo repositories.IScoutListRepository
	userRepo      repositories.IUserRepository
	tagRepo       repositories.ITagRepository
	memberRepo    repositories.IMemberRepository
	communityRepo repositories.ICommunityRepository
	messageRepo   repositories.MessageRepository
	mailClient    mail.IMailClient
}

func NewScoutListUsecase(repo repositories.IScoutListRepository, userRepo repositories.IUserRepository, communityRepo repositories.ICommunityRepository, messageRepo repositories.MessageRepository, tagRepo repositories.ITagRepository, memberRepo repositories.IMemberRepository, mailClient mail.IMailClient) IScoutListUsecase {
	return &scoutListUsecase{
		scoutListRepo: repo,
		userRepo:      userRepo,
		communityRepo: communityRepo,
		messageRepo:   messageRepo,
		tagRepo:       tagRepo,
		memberRepo:    memberRepo,
		mailClient:    mailClient,
	}
}

func (u *scoutListUsecase) Create(ctx context.Context, scoutDetailList *models.ScoutList, content string) error {
	// トランザクション的な処理のために、データベース処理を先に行う
	err := u.scoutListRepo.Create(ctx, scoutDetailList)
	if err != nil {
		return err
	}

	// ユーザー情報取得
	user, err := u.userRepo.FindByID(ctx, scoutDetailList.User_UUID.String())
	if err != nil {
		return err
	}

	// コミュニティ情報取得
	community, err := u.communityRepo.FindByID(ctx, scoutDetailList.Community_UUID.String())
	if err != nil {
		return err
	}

	// 非同期でメール送信
	go func() {
		err := u.mailClient.SendEmail(content, user, community)
		if err != nil {
			// エラーログを記録
			log.Printf("Failed to send email: %v", err)
		}
	}()

	return nil
}

// アプリケーション終了時にクリーンアップするために
func (u *scoutListUsecase) Cleanup() {
	u.mailClient.Close()
}
func (u *scoutListUsecase) ChangeStatus(ctx context.Context, ID uint, status models.ScoutStatus) error {
	scoutList, err := u.scoutListRepo.FindByID(ctx, ID)
	if err != nil {
		return fmt.Errorf("failed to find scout list by ID: %w", err)
	}
	if scoutList.Status == models.Approve || scoutList.Status == models.Reject {
		return fmt.Errorf("this scout list is already handled with status: %v", scoutList.Status)
	}

	return u.scoutListRepo.ChangeStatus(ctx, ID, status)
}

func (u *scoutListUsecase) GetWithCommunityDetails(ctx context.Context, UserUUID string) ([]models.ScoutListResponse, error) {
	scoutlists, err := u.scoutListRepo.GetByUserUUID(ctx, UserUUID)
	if err != nil {
		return nil, err
	}

	responses := make([]models.ScoutListResponse, 0, len(scoutlists))
	for _, scoutlist := range scoutlists {
		if scoutlist.Status != models.Approve {
			continue
		}
		detail, err := u.communityRepo.FindByID(ctx, scoutlist.Community_UUID.String())
		if err != nil {
			return nil, err
		}
		unreadcount, err := u.messageRepo.GetCountByStatus(scoutlist.User_UUID.String(), 0)
		if err != nil {
			return nil, fmt.Errorf("failed to get unread count for user %s: %w", scoutlist.User_UUID.String(), err)
		}

		// Mem1 の取得
		mem1, err := u.memberRepo.FindByID(ctx, detail.Mem1)
		if err != nil {
			return nil, fmt.Errorf("failed to get unread member1 %s: %w", detail.Mem1, err)
		}

		// Tags の取得
		tagNames := make([]string, 0, len(detail.Tags))
		tagColor := make([]string, 0, len(detail.Tags))
		for _, tagID := range detail.Tags {
			tag, err := u.tagRepo.FindTagByID(ctx, tagID)
			if err != nil {
				return nil, fmt.Errorf("failed to find tag by ID (%d): %w", tagID, err)
			}
			tagNames = append(tagNames, tag.Name)
			tagColor = append(tagColor, tag.Color)
		}

		response := models.ScoutListResponse{
			ID:          scoutlist.ID,
			Status:      scoutlist.Status,
			UUID:        scoutlist.Community_UUID,
			UnreadCount: unreadcount,
			Scoutdate:   scoutlist.Scoutdate,
			DetailInfo: models.DetailInfo{
				Name:     detail.Name,
				Img:      detail.Img,
				Mem1:     mem1.Name,
				Tags:     tagNames,
				TagColor: tagColor,
			},
		}
		responses = append(responses, response)
	}

	return responses, nil
}

func (u *scoutListUsecase) GetCommunityDetailsWithScoutLists(ctx context.Context, UserUUID string) ([]models.ScoutListResponse, error) {
	scoutlists, err := u.scoutListRepo.GetByUserUUID(ctx, UserUUID)
	if err != nil {
		return nil, err
	}

	responses := make([]models.ScoutListResponse, 0, len(scoutlists))
	for _, scoutlist := range scoutlists {
		if scoutlist.Status == models.Approve || scoutlist.Status == models.Reject {
			continue
		}
		detail, err := u.communityRepo.FindByID(ctx, scoutlist.Community_UUID.String())
		if err != nil {
			return nil, err
		}

		// Mem1 の取得
		mem1, err := u.memberRepo.FindByID(ctx, detail.Mem1)
		if err != nil {
			return nil, fmt.Errorf("failed to get unread member1 %s: %w", detail.Mem1, err)
		}

		// Tags の取得
		tagNames := make([]string, 0, len(detail.Tags))
		tagColor := make([]string, 0, len(detail.Tags))
		for _, tagID := range detail.Tags {
			tag, err := u.tagRepo.FindTagByID(ctx, tagID)
			if err != nil {
				return nil, fmt.Errorf("failed to find tag by ID (%d): %w", tagID, err)
			}
			tagNames = append(tagNames, tag.Name)
			tagColor = append(tagColor, tag.Color)
		}

		response := models.ScoutListResponse{
			ID:        scoutlist.ID,
			Status:    scoutlist.Status,
			UUID:      scoutlist.Community_UUID,
			Scoutdate: scoutlist.Scoutdate,
			DetailInfo: models.DetailInfo{
				Name:     detail.Name,
				Img:      detail.Img,
				Mem1:     mem1.Name,
				Tags:     tagNames,
				TagColor: tagColor,
			},
		}
		responses = append(responses, response)
	}

	return responses, nil
}

func (u *scoutListUsecase) GetWithUserDetail(ctx context.Context, communityUUID string) ([]models.ScoutListResponse, error) {
	scoutlists, err := u.scoutListRepo.GetByCommunityUUID(ctx, communityUUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get scout lists: %w", err)
	}

	if len(scoutlists) == 0 {
		return []models.ScoutListResponse{}, nil
	}

	responses := make([]models.ScoutListResponse, 0, len(scoutlists))
	for _, scoutlist := range scoutlists {
		if scoutlist.Status != models.Approve {
			continue
		}
		detail, err := u.userRepo.FindByID(ctx, scoutlist.User_UUID.String())
		if err != nil {
			return nil, fmt.Errorf("failed to find community details: %w", err)
		}
		unreadcount, err := u.messageRepo.GetCountByStatus(scoutlist.User_UUID.String(), 0)
		if err != nil {
			return nil, fmt.Errorf("failed to get unread count for user %s: %w", scoutlist.User_UUID.String(), err)
		}

		// Mem1 の取得
		mem1, err := u.memberRepo.FindByID(ctx, detail.Mem1)
		if err != nil {
			return nil, fmt.Errorf("failed to get unread member1 %s: %w", detail.Mem1, err)
		}

		// Tags の取得
		tagNames := make([]string, 0, len(detail.Tags))
		tagColor := make([]string, 0, len(detail.Tags))
		for _, tagID := range detail.Tags {
			tag, err := u.tagRepo.FindTagByID(ctx, tagID)
			if err != nil {
				return nil, fmt.Errorf("failed to find tag by ID (%d): %w", tagID, err)
			}
			tagNames = append(tagNames, tag.Name)
			tagColor = append(tagColor, tag.Color)
		}

		response := models.ScoutListResponse{
			ID:          scoutlist.ID,
			Status:      scoutlist.Status,
			UUID:        scoutlist.User_UUID,
			UnreadCount: unreadcount,
			DetailInfo: models.DetailInfo{
				Name:     detail.Name,
				Img:      detail.Img,
				Mem1:     mem1.Name,
				Tags:     tagNames,
				TagColor: tagColor,
			},
		}
		responses = append(responses, response)
	}

	return responses, nil
}
