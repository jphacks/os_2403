package usecase

import (
	"context"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type InputTagUpdate struct {
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

type ITagUsecase interface {
	GetRandom(ctx context.Context) ([]*models.Tag, error)
}

type tagUsecase struct {
	tagRepo repositories.ITagRepository
}

func NewTagUseCase(tagRepo repositories.ITagRepository) ITagUsecase {
	return &tagUsecase{
		tagRepo: tagRepo,
	}
}

func (u *tagUsecase) GetRandom(ctx context.Context) ([]*models.Tag, error) {

	tags, err := u.tagRepo.GetRandomTags(ctx, 16)
	if err != nil {
		return nil, err
	}

	return tags, nil
}
