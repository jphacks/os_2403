package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type IMemberRepository interface {
	Create(ctx context.Context, member *models.Member) (uint, error)
	FindByID(ctx context.Context, id uint) (*models.Member, error)
}
