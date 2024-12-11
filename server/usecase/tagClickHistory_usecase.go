package usecase

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type CreateTagClickHistoryInput struct {
	UUID    string
	TagName string //一旦IDではなく送られてくる予定のNameを保存する方針です。
	Action  string
}

type ITagClickHistoryUsecase interface {
	Create(ctx context.Context, input CreateTagClickHistoryInput) error
}

type TagClickHistoryUsecase struct {
	tagClickHistoryRepository repositories.ITagClickHistory
}

func NewTagClickHistoryUsecase(tagClickHistoryRepository repositories.ITagClickHistory) *TagClickHistoryUsecase {
	return &TagClickHistoryUsecase{
		tagClickHistoryRepository: tagClickHistoryRepository,
	}
}

func (u *TagClickHistoryUsecase) Create(ctx context.Context, input CreateTagClickHistoryInput) error {
	err := u.tagClickHistoryRepository.Create(ctx, &models.TagClickHistory{
		UUID:   input.UUID,
		Tag:    input.TagName,
		Action: input.Action,
	})

	if err != nil {
		return err
	}
	return nil
}
