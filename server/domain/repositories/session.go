package repositories

import (
	"context"
	"github.com/jphacks/os_2403/domain/models"
)

type ISessionRepository interface {
	Create(ctx context.Context, session *models.Session) error
	Get(ctx context.Context, sessionKye string) (string, error)
}
