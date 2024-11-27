package usecase

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"golang.org/x/crypto/bcrypt"
)

type InputSignUp struct {
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

type InputSignIn struct {
	Email    string
	Password string
}

type IAuthUsecase interface {
	SignUp(ctx context.Context, input InputSignUp) (uuid.UUID, error)
	SignIn(ctx context.Context, input InputSignIn) (uuid.UUID, error)
}

type authUsecase struct {
	userRepo    repositories.IUserRepository
	sessionRepo repositories.ISessionRepository
	memberRepo  repositories.IMemberRepository
	tagRepo     repositories.ITagRepository
}

func NewAuthUserUseCase(userRepo repositories.IUserRepository, sessionRepo repositories.ISessionRepository, memberRepo repositories.IMemberRepository, tagRepo repositories.ITagRepository) IAuthUsecase {
	return &authUsecase{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
		memberRepo:  memberRepo,
		tagRepo:     tagRepo,
	}
}

func (u *authUsecase) SignUp(ctx context.Context, input InputSignUp) (uuid.UUID, error) {
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
		return uuid.Nil, fmt.Errorf("failed to hash password: %v", err)
	}

	// 新規ユーザーの作成
	user = &models.User{
		UUID:     uuid.New(),
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

	if err := u.userRepo.Create(ctx, user); err != nil {
		return uuid.Nil, err
	}

	return user.UUID, nil
}

func (u *authUsecase) SignIn(ctx context.Context, input InputSignIn) (uuid.UUID, error) {
	fmt.Println("User SignIn Usecase")
	// ユーザーをリポジトリから取得
	user, err := u.userRepo.FindByEmail(ctx, input.Email)
	if err != nil {
		return uuid.Nil, fmt.Errorf("failed to get user: %w", err)
	}

	// ハッシュ化されたパスワードと入力されたパスワードを比較
	err = bcrypt.CompareHashAndPassword(user.Password, []byte(input.Password))
	if err != nil {
		return uuid.Nil, fmt.Errorf("invalid credentials: %w", err)
	}

	// ログイン成功
	return user.UUID, nil
}
