package usecase

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"gopkg.in/gomail.v2"
	"os"
)

type IScoutListUsecase interface {
	Create(ctx context.Context, scoutList *models.ScoutList, context string) error
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetWithCommunityDetails(ctx context.Context, userUUID string) ([]models.ScoutListResponse, error)
	GetWithUserDetail(ctx context.Context, communityUUID string) ([]models.ScoutListResponse, error)
}

type scoutListUsecase struct {
	scoutListRepo repositories.IScoutListRepository
	userRepo      repositories.IUserRepository
	tagRepo       repositories.ITagRepository
	memberRepo    repositories.IMemberRepository
	communityRepo repositories.ICommunityRepository
	messageRepo   repositories.MessageRepository
}

func NewScoutListUsecase(repo repositories.IScoutListRepository, userRepo repositories.IUserRepository, communityRepo repositories.ICommunityRepository, messageRepo repositories.MessageRepository, tagRepo repositories.ITagRepository, memberRepo repositories.IMemberRepository) IScoutListUsecase {
	return &scoutListUsecase{
		scoutListRepo: repo,
		userRepo:      userRepo,
		communityRepo: communityRepo,
		messageRepo:   messageRepo,
		tagRepo:       tagRepo,
		memberRepo:    memberRepo,
	}
}

func (u *scoutListUsecase) Create(ctx context.Context, scoutDetailList *models.ScoutList, context string) error {
	var user *models.User
	var community *models.Community

	user, err := u.userRepo.FindByID(ctx, scoutDetailList.User_UUID.String())
	if err != nil {
		return err
	}

	community, err = u.communityRepo.FindByID(ctx, scoutDetailList.Community_UUID.String())
	if err != nil {
		return err
	}

	// メール送信
	err = sendEmail(context, user, community)
	if err != nil {
		return err
	}
	return u.scoutListRepo.Create(ctx, scoutDetailList)
}

func (u *scoutListUsecase) ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error {
	return u.scoutListRepo.ChangeStatus(ctx, userUUID, status)
}

func (u *scoutListUsecase) GetWithCommunityDetails(ctx context.Context, UserUUID string) ([]models.ScoutListResponse, error) {
	scoutlists, err := u.scoutListRepo.GetByUserUUID(ctx, UserUUID)
	if err != nil {
		return nil, err
	}

	responses := make([]models.ScoutListResponse, 0, len(scoutlists))
	for _, scoutlist := range scoutlists {
		detail, err := u.communityRepo.FindByID(ctx, scoutlist.Community_UUID.String())
		if err != nil {
			return nil, err
		}
		unreadcount, err := u.messageRepo.GetCountByStatus(scoutlist.User_UUID.String(), scoutlist.Status)
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
		detail, err := u.userRepo.FindByID(ctx, scoutlist.User_UUID.String())
		if err != nil {
			return nil, fmt.Errorf("failed to find community details: %w", err)
		}
		unreadcount, err := u.messageRepo.GetCountByStatus(scoutlist.User_UUID.String(), scoutlist.Status)
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

func sendEmail(content string, user *models.User, community *models.Community) error {

	m := gomail.NewMessage()

	// 送信元
	m.SetHeader("From", "tarakokko3233@gmail.com")

	// 送信先
	m.SetHeader("To", user.Email)

	// 件名
	m.SetHeader("Subject", "[hubme]コミュニティからのスカウト")

	// メール本文にpublisherを追加
	body := community.Name + "community.Email" + " このコミュニティに参加してみませんか？" + "\n" + "https://hubme.click" + "\n" + content
	m.SetBody("text/plain", body)

	// ダイヤラの設定
	d := gomail.NewDialer("smtp.gmail.com", 587, "tarakokko3233@gmail.com", os.Getenv("GOOGLE_ACCOUNT_TOKEN"))

	// GmailはTLS接続を要求
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// メール送信
	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
