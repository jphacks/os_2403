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
	Text     string
}

type IUesrUsecase interface {
	Update(ctx context.Context, input InputUserUpdate) error
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
	}

	fmt.Println(user)

	if err := u.userRepo.Update(ctx, user); err != nil {
		return err
	}

	return nil
}
