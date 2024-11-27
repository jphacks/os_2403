package usecase

import (
	"context"
	"crypto/tls"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"gopkg.in/gomail.v2"
)

type IScoutListUsecase interface {
	Create(ctx context.Context, scoutList *models.ScoutList) error
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetWithCommunityDetails(ctx context.Context, userUUID string) ([]models.ScoutListCommunityResponse, error)
	GetWithUserDetail(ctx context.Context, userUUID string) ([]models.ScoutListUserResponse, error)
	GetUsersWithStatus(ctx context.Context, userUUID uuid.UUID, status uint) ([]models.MessageUser, error)
	GetCommunitiesWithStatus(ctx context.Context, communityUUID uuid.UUID, status uint) ([]models.MessageCommunity, error)
}

type scoutListUsecase struct {
	scoutListRepo repositories.IScoutListRepository
	userRepo      repositories.IUserRepository
	communityRepo repositories.ICommunityRepository
}

type CreateScoutsRequest struct {
	Tags          int    `json:"tags"`
	CommunityUUID string `json:"community_uuid"`
}

func NewScoutListUsecase(repo repositories.IScoutListRepository, userRepo repositories.IUserRepository, communityRepo repositories.ICommunityRepository) IScoutListUsecase {
	return &scoutListUsecase{
		scoutListRepo: repo,
		userRepo:      userRepo,
		communityRepo: communityRepo,
	}
}

func (u *scoutListUsecase) Create(ctx context.Context, scoutDetailList *models.ScoutList) error {
	// メール送信
	var recipients []string
	var user *models.User
	var community *models.Community

	user, err := u.userRepo.FindByID(ctx, scoutDetailList.User_UUID.String())
	if err != nil {
		return err
	}

	recipients = append(recipients, user.Email)
	community, err = u.communityRepo.FindByID(ctx, scoutDetailList.Community_UUID.String())

	fmt.Println(recipients)

	community, err = u.communityRepo.FindByID(ctx, scoutDetailList.Community_UUID.String())
	if err != nil {
		return err
	}
	err = sendEmail(recipients, community.Name)
	if err != nil {
		return err
	}
	return u.scoutListRepo.Create(ctx, scoutDetailList)
}

func (u *scoutListUsecase) ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error {
	return u.scoutListRepo.ChangeStatus(ctx, userUUID, status)
}

func (u *scoutListUsecase) GetWithCommunityDetails(ctx context.Context, communityUUID string) ([]models.ScoutListCommunityResponse, error) {

	scoutlists, err := u.scoutListRepo.GetByCommunityUUID(ctx, communityUUID)
	if err != nil {
		return nil, err
	}

	detail, err := u.communityRepo.FindByID(ctx, communityUUID)
	if err != nil {
		return nil, err
	}

	var responses []models.ScoutListCommunityResponse
	for _, scoutlist := range scoutlists {
		response := models.ScoutListCommunityResponse{
			ID:             scoutlist.ID,
			Status:         scoutlist.Status,
			Community_UUID: scoutlist.Community_UUID,
			DetailInfo: models.DetailInfo{
				Name: detail.Name,
				Img:  detail.Img,
				Self: detail.Self,
				Mem1: detail.Mem1,
				Mem2: detail.Mem2,
				Mem3: detail.Mem3,
				Tags: detail.Tags,
			},
		}
		responses = append(responses, response)
	}

	return responses, nil
}

func (u *scoutListUsecase) GetWithUserDetail(ctx context.Context, userUUID string) ([]models.ScoutListUserResponse, error) {

	scoutlists, err := u.scoutListRepo.GetByUserUUID(ctx, userUUID)
	if err != nil {
		return nil, err
	}

	detail, err := u.userRepo.FindByID(ctx, userUUID)
	if err != nil {
		return nil, err
	}

	var responses []models.ScoutListUserResponse
	for _, scoutlist := range scoutlists {
		response := models.ScoutListUserResponse{
			ID:        scoutlist.ID,
			Status:    scoutlist.Status,
			User_UUID: scoutlist.Community_UUID,
			DetailInfo: models.DetailInfo{
				Name: detail.Name,
				Img:  detail.Img,
				Self: detail.Self,
				Mem1: detail.Mem1,
				Mem2: detail.Mem2,
				Mem3: detail.Mem3,
				Tags: detail.Tags,
			},
		}
		responses = append(responses, response)
	}

	return responses, nil
}

func sendEmail(recipients []string, publisher string) error {
	fmt.Println("hogehoge")

	m := gomail.NewMessage()

	// 送信元
	m.SetHeader("From", "tarakokko3233@gmail.com")

	// 送信先（自分のメールアドレス）
	m.SetHeader("To", "tarakokko3233@gmail.com")

	// BCCに受信者を追加
	m.SetHeader("Bcc", recipients...)

	// 件名
	m.SetHeader("Subject", "[hubme]コミュニティからのスカウト")

	// メール本文にpublisherを追加
	body := publisher + " このコミュニティに参加してみませんか？" + "\n" + "https://hubme.link"
	m.SetBody("text/plain", body)

	// ダイヤラの設定
	d := gomail.NewDialer("smtp.gmail.com", 587, "tarakokko3233@gmail.com", "njee ivlt vsah hruy")

	// GmailはTLS接続を要求
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// メール送信
	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}

func (u *scoutListUsecase) GetUsersWithStatus(ctx context.Context, userUUID uuid.UUID, status uint) ([]models.MessageUser, error) {
	return u.scoutListRepo.GetUsersWithStatus(ctx, userUUID, status)
}

func (u *scoutListUsecase) GetCommunitiesWithStatus(ctx context.Context, communityUUID uuid.UUID, status uint) ([]models.MessageCommunity, error) {
	return u.scoutListRepo.GetCommunitiesWithStatus(ctx, communityUUID, status)
}
