package models

import (
	"github.com/google/uuid"
	"time"
)

type ScoutList struct {
	ID             uint       `gorm:"primarykey"`
	User_UUID      uuid.UUID  `gorm:"type:varchar(36);column:user_uuid"` // タグを1つに統合
	Status         uint       `gorm:"type:int unsigned"`
	Community_UUID uuid.UUID  `gorm:"type:varchar(36)"`
	CreatedAt      time.Time  `gorm:"type:timestamp"`
	UpdatedAt      time.Time  `gorm:"type:timestamp"`
	DeletedAt      *time.Time `gorm:"type:timestamp"`
	Community      Community  `gorm:"foreignKey:Community_UUID;references:UUID"`
}

type ScoutListCommunityResponse struct {
	ID             uint       `json:"id"`
	Status         uint       `json:"status"`
	Community_UUID uuid.UUID  `json:"community_uuid"`
	DetailInfo     DetailInfo `json:"detail_info"`
}

type ScoutListUserResponse struct {
	ID         uint       `json:"id"`
	Status     uint       `json:"status"`
	User_UUID  uuid.UUID  `json:"user_uuid"`
	DetailInfo DetailInfo `json:"detail_info"`
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
