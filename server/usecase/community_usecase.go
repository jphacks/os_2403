package usecase

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"golang.org/x/crypto/bcrypt"
)

type InputCommunityUpdate struct {
	UUID     uuid.UUID
	Name     string
	Email    string
	Password string
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Range    []int
}

type InputCommunityFindByID struct {
	UUID uuid.UUID
}

type ICommunityUsecase interface {
	Update(ctx context.Context, input InputCommunityUpdate) error
	FindByID(ctx context.Context, input InputCommunityFindByID) (*models.Community, error)
}

type communityUsecase struct {
	communityRepo repositories.ICommunityRepository
	memberRepo    repositories.IMemberRepository
	tagRepo       repositories.ITagRepository
}

func NewCommunityUseCase(communityRepo repositories.ICommunityRepository, memberRepo repositories.IMemberRepository, tagRepo repositories.ITagRepository) ICommunityUsecase {
	return &communityUsecase{
		communityRepo: communityRepo,
		memberRepo:    memberRepo,
		tagRepo:       tagRepo,
	}
}

func (u *communityUsecase) Update(ctx context.Context, input InputCommunityUpdate) error {
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
		return fmt.Errorf("failed to hash password: %v", err)
	}

	// 新規ユーザーの作成
	community = &models.Community{
		UUID:     input.UUID,
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
		Img:      input.Img,
		Self:     input.Self,
		Mem1:     mem1ID,
		Mem2:     mem2ID,
		Mem3:     mem3ID,
	}

	fmt.Println(community)

	if err := u.communityRepo.Update(ctx, community); err != nil {
		return err
	}

	return nil
}

func (u *communityUsecase) FindByID(ctx context.Context, input InputCommunityFindByID) (*models.Community, error) {
	community, err := u.communityRepo.FindByID(ctx, input.UUID.String())
	if err != nil {
		return nil, err
	}
	return community, nil
}
