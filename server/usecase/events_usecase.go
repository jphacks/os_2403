package usecase

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type IEventUsecase interface {
	GetAllEvents(ctx context.Context) ([]models.Event, error)
	CreateEvent(ctx context.Context, event *models.Event) error
	UpdateEvent(ctx context.Context, event *models.Event) error
}

type eventUsecase struct {
	eventRepo repositories.IEventRepository
}

func NewEventUsecase(eventRepo repositories.IEventRepository) IEventUsecase {
	return &eventUsecase{eventRepo: eventRepo}
}

func (u *eventUsecase) GetAllEvents(ctx context.Context) ([]models.Event, error) {
	return u.eventRepo.GetAllEvents(ctx)
}

func (u *eventUsecase) CreateEvent(ctx context.Context, event *models.Event) error {
	return u.eventRepo.Create(ctx, event)
}

func (u *eventUsecase) UpdateEvent(ctx context.Context, event *models.Event) error {
	return u.eventRepo.Update(ctx, event)
}
