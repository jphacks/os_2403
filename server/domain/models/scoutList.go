package models

import (
	"github.com/google/uuid"
	"time"
)

type ScoutList struct {
	ID             uint       `gorm:"primarykey"`
	User_UUID      uuid.UUID  `gorm:"type:varchar(36);column:user_uuid"`
	Status         uint       `gorm:"type:int unsigned"`
	Community_UUID uuid.UUID  `gorm:"type:varchar(36)"`
	CreatedAt      time.Time  `gorm:"type:timestamp"`
	UpdatedAt      time.Time  `gorm:"type:timestamp"`
	DeletedAt      *time.Time `gorm:"type:timestamp"`
}

type ScoutListResponse struct {
	ID          uint       `json:"id"`
	Status      uint       `json:"status"`
	UnreadCount uint       `json:"unread_count"`
	UUID        uuid.UUID  `json:"uuid"`
	DetailInfo  DetailInfo `json:"detail_info"`
}

type DetailInfo struct {
	Name string `json:"name"`
	Img  string `json:"img"`
}

type MessageCommunity struct {
	CommunityUUID uuid.UUID `json:"community_uuid"`
	Name          string    `json:"name"`
	Img           string    `json:"img"`
}

type MessageUser struct {
	UserUUID uuid.UUID `json:"user_uuid"`
	Name     string    `json:"name"`
	Img      string    `json:"img"`
}
