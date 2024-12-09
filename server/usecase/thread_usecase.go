package usecase

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"github.com/jphacks/os_2403/infrastructure/middleware"
	"strconv"
)

type IThreadUsecase interface {
	CreateThread(context.Context, string, []*models.Tag) (error, uint)
	ThreadMessage(context.Context, string, *models.Tags) error
}

type ThreadUsecase struct {
	threadRepo repositories.IThreadRepository
	wsService  *middleware.WebSocketService
}

func NewThreadUsecase(threadRepo repositories.IThreadRepository, wsService *middleware.WebSocketService) IThreadUsecase {
	return &ThreadUsecase{
		threadRepo: threadRepo,
		wsService:  wsService,
	}
}

func (u *ThreadUsecase) CreateThread(ctx context.Context, uuid string, tags []*models.Tag) (error, uint) {
	//GPTでThread作ってIDを返してほしい
	id := "treadID"

	thread, err := u.threadRepo.Create(ctx, &models.Thread{
		UserUUID: uuid,
		ThreadID: id,
	})
	if err != nil {
		return err, 0
	}
	return nil, thread.ID
}

func (thread *ThreadUsecase) ThreadMessage(ctx context.Context, threadID string, message *models.Tags) error {
	id, err := strconv.Atoi(threadID) // 文字列を整数に変換
	if err != nil {
		return err
	}
	thread.wsService.BroadcastToRoom(id, message)
	return nil
}
