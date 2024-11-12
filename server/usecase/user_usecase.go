package usecase

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"golang.org/x/crypto/bcrypt"
)

type InputUserUpdate struct {
	UUID     uuid.UUID
	Name     string
	Email    string
	Password string
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Tags     []string `json:"tag"`
}

// uuid
type InputUserFindByID struct {
	UUID string
}

type UserResponse struct {
	UUID     uuid.UUID
	Name     string
	Email    string
	Password []byte
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Tags     []int `json:"tag"`
}

type IUesrUsecase interface {
	Update(ctx context.Context, input InputUserUpdate) error
	FindByID(ctx context.Context, input InputUserFindByID) (*UserResponse, error)
	FindByTags(ctx context.Context, input CreateScoutsRequest) ([]*models.User, error)
}

type userUsecase struct {
	userRepo   repositories.IUserRepository
	memberRepo repositories.IMemberRepository
	tagRepo    repositories.ITagRepository
}

func NewUserUseCase(userRepo repositories.IUserRepository, memberRepo repositories.IMemberRepository, tagRepo repositories.ITagRepository) IUesrUsecase {
	return &userUsecase{
		userRepo:   userRepo,
		memberRepo: memberRepo,
		tagRepo:    tagRepo,
	}
}

func (u *userUsecase) Update(ctx context.Context, input InputUserUpdate) error {
	fmt.Println("usecase")
	fmt.Println(input)
	var user *models.User

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

	var tags []int

	for _, t := range input.Tags {
		tag := &models.Tag{
			Name: t,
		}
		tag_num, _ := u.tagRepo.Create(ctx, tag)

		tags = append(tags, tag_num) // tagsにtag_numを追加
	}

	fmt.Println(mem3ID)

	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	// 新規ユーザーの作成
	user = &models.User{
		UUID:     input.UUID,
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPassword,
		Img:      input.Img,
		Self:     input.Self,
		Mem1:     mem1ID,
		Mem2:     mem2ID,
		Mem3:     mem3ID,
		Tags:     tags,
	}

	fmt.Println(user)

	if err := u.userRepo.Update(ctx, user); err != nil {
		return err
	}

	return nil
}

func (u *userUsecase) FindByID(ctx context.Context, input InputUserFindByID) (*UserResponse, error) {
	user, err := u.userRepo.FindByID(ctx, input.UUID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	mem1, _ := u.memberRepo.FindByID(ctx, user.Mem1)
	mem2, _ := u.memberRepo.FindByID(ctx, user.Mem2)
	mem3, _ := u.memberRepo.FindByID(ctx, user.Mem3)

	res := UserResponse{
		UUID:     user.UUID,
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
		Img:      user.Img,
		Self:     user.Self,
		Mem1:     mem1.Name,
		Mem2:     mem2.Name,
		Mem3:     mem3.Name,
		Tags:     user.Tags,
	}
	return &res, nil
}

func (u *userUsecase) FindByTags(ctx context.Context, input CreateScoutsRequest) ([]*models.User, error) {
	user, err := u.userRepo.FindByTag(ctx, input.Tags)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}
