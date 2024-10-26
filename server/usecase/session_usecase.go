package usecase

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type InputSession struct {
	SessionKey string
	UserID     string
}

type ISessionUsecase interface {
	Create(ctx context.Context, input InputSession) error
	GetUserID(ctx context.Context, sessionKey string) (userID string, err error)
}

type sessionUsecase struct {
	sessionRepo repositories.ISessionRepository
	userRepo    repositories.IUserRepository
}

func NewSessionUseCase(sessionRepo repositories.ISessionRepository, userRepo repositories.IUserRepository) ISessionUsecase {
	return &sessionUsecase{
		sessionRepo: sessionRepo,
		userRepo:    userRepo,
	}
}

func (u *sessionUsecase) Create(ctx context.Context, input InputSession) error {
	var session *models.Session

	session = &models.Session{
		SessionKey: input.SessionKey,
		User_UUID:  input.UserID,
	}

	err := u.sessionRepo.Create(ctx, session)
	if err != nil {
		return err
	}

	return nil
}

func (u *sessionUsecase) GetUserID(ctx context.Context, sessionKey string) (string, error) {
	userID, err := u.sessionRepo.Get(ctx, sessionKey)
	if err != nil {
		return "", err
	}

	return userID, nil
}
