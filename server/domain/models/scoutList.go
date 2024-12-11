package models

import (
	"github.com/google/uuid"
	"time"
)

type ScoutStatus string

const (
	Unread  ScoutStatus = "unread"
	Read    ScoutStatus = "read"
	Approve ScoutStatus = "approve"
	Reject  ScoutStatus = "reject"
)

type ScoutList struct {
	ID             uint        `gorm:"primarykey"`
	User_UUID      uuid.UUID   `gorm:"type:char(36);column:user_uuid"`
	Status         ScoutStatus `gorm:"type:enum('unread','read','approve','reject');default:unread"`
	Community_UUID uuid.UUID   `gorm:"type:char(36)"`
	Scoutdate      time.Time   `gorm:"type:timestamp"`
	CreatedAt      time.Time   `gorm:"type:timestamp"`
	UpdatedAt      time.Time   `gorm:"type:timestamp"`
	DeletedAt      *time.Time  `gorm:"type:timestamp"`
}

type ScoutListResponse struct {
	ID          uint        `json:"id"`
	Status      ScoutStatus `json:"status"`
	UnreadCount uint        `json:"unread_count"`
	Scoutdate   time.Time   `json:"scoutdate"`
	UUID        uuid.UUID   `json:"uuid"`
	DetailInfo  DetailInfo  `json:"detail_info"`
}

type DetailInfo struct {
	Name     string   `json:"name"`
	Img      string   `json:"img"`
	Mem1     string   `json:"mem1"`
	Tags     []string `json:"tags"`
	TagColor []string `json:"tag_color"`
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
