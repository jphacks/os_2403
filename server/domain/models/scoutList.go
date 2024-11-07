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
	Community      Community  `gorm:"foreignKey:Community_UUID;references:UUID"`
}

type ScoutListResponse struct {
	ID             uint          `json:"id"`
	Status         uint          `json:"status"`
	Community_UUID uuid.UUID     `json:"community_uuid"`
	CommunityInfo  CommunityInfo `json:"community_info"`
}

type CommunityInfo struct {
	Name string `json:"name"`
	Img  string `json:"img"`
	Self string `json:"self"`
	Mem1 uint   `json:"mem1"`
	Mem2 uint   `json:"mem2"`
	Mem3 uint   `json:"mem3"`
	Tags []int  `json:"tags"`
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
