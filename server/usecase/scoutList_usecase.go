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
	Get(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
	ChangeStatus(ctx context.Context, userUUID uuid.UUID, status uint) error
	GetWithCommunityDetails(ctx context.Context, userUUID uuid.UUID) ([]models.ScoutListResponse, error)
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
	var community *models.Community

	user, err := u.userRepo.FindByID(ctx, scoutDetailList.User_UUID.String())
	if err != nil {
		return err
	}

	recipients = append(recipients, user.Email)

	fmt.Println(recipients)

	community, err = u.communityRepo.FindByID(ctx, scoutDetailList.Community_UUID)
	if err != nil {
		return err
	}
	err = sendEmail(recipients, community.Name)
	if err != nil {
		return err
	}
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
