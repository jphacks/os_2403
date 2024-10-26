package models

import (
	"github.com/google/uuid"
	"time"
)

type ScoutList struct {
	ID             uint       `gorm:"primarykey"`
	User_UUID      uuid.UUID  `gorm:"type:varchar(36)"`
	Status         uint       `gorm:"type:int unsigned"`
	Community_UUID uuid.UUID  `gorm:"type:varchar(36)"`
	CreatedAt      time.Time  `gorm:"type:timestamp"`
	UpdatedAt      time.Time  `gorm:"type:timestamp"`
	DeletedAt      *time.Time `gorm:"type:timestamp"`
}

type ScoutDetailList struct {
	User_UUID      uuid.UUID `gorm:"type:varchar(36)"`
	Status         uint      `gorm:"type:int unsigned"`
	Community_UUID uuid.UUID `gorm:"type:varchar(36)"`
}

type ScoutListResponse struct {
	ID             uint      `json:"id"`
	Status         uint      `json:"status"`
	Community_UUID uuid.UUID `json:"community_uuid"`
}
