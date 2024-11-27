package usecase

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"golang.org/x/crypto/bcrypt"
)

type InputCommunitySignUp struct {
	Name     string
	Email    string
	Password string
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Text     string
	Range    []int
}

type InputCommunitySignIn struct {
	Email    string
	Password string
}

type IAuthCommunityUsecase interface {
	SignUp(ctx context.Context, input InputCommunitySignUp) (uuid.UUID, error)
	SignIn(ctx context.Context, input InputCommunitySignIn) (uuid.UUID, error)
}

type authCommunityUsecase struct {
	communityRepo repositories.ICommunityRepository
	sessionRepo   repositories.ISessionRepository
	memberRepo    repositories.IMemberRepository
	tagRepo       repositories.ITagRepository
}

func NewAuthCommunityUseCase(community repositories.ICommunityRepository, sessionRepo repositories.ISessionRepository, memberRepo repositories.IMemberRepository, tagRepo repositories.ITagRepository) IAuthCommunityUsecase {
	return &authCommunityUsecase{
		communityRepo: community,
		sessionRepo:   sessionRepo,
		memberRepo:    memberRepo,
		tagRepo:       tagRepo,
	}
}

func (u *authCommunityUsecase) SignUp(ctx context.Context, input InputCommunitySignUp) (uuid.UUID, error) {
	fmt.Println("usecase")
	fmt.Println(input)

	var community *models.Community

	mem1 := &models.Member{
		Name: input.Mem1,
	}
	mem1ID, _ := u.memberRepo.Create(ctx, mem1)

	mem2 := &models.Member{
		Name: input.Mem2,
	}
	mem2ID, _ := u.memberRepo.Create(ctx, mem2)

	mem3 := &models.Member{
		Name: input.Mem3,
	}
	mem3ID, _ := u.memberRepo.Create(ctx, mem3)

	fmt.Println(mem3ID)

	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return uuid.Nil, fmt.Errorf("failed to hash password: %v", err)
	}

	fmt.Println(input.Range)

	// 新規ユーザーの作成
	community = &models.Community{
		UUID:     uuid.New(),
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
		Img:      input.Img,
		Self:     input.Self,
		Mem1:     mem1ID,
		Mem2:     mem2ID,
		Mem3:     mem3ID,
		MemRange: models.IntArray(input.Range), // IntArray型に変換
	}

	fmt.Println(community)

	if err := u.communityRepo.Create(ctx, community); err != nil {
		return uuid.Nil, err
	}

	return community.UUID, nil
}

func (u *authCommunityUsecase) SignIn(ctx context.Context, input InputCommunitySignIn) (uuid.UUID, error) {
	// ユーザーをリポジトリから取得
	community, err := u.communityRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		return uuid.Nil, fmt.Errorf("failed to get user: %w", err)
	}

	// ハッシュ化されたパスワードと入力されたパスワードを比較
	err = bcrypt.CompareHashAndPassword([]byte(community.Password), []byte(input.Password))
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid credentials: %w", err)
	}

	// ログイン成功
	return community.UUID, nil
}
