package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Event struct {
	ID            uint           `gorm:"primaryKey;autoIncrement" json:"id"`
	CommunityUUID uuid.UUID      `gorm:"type:varchar(36);index;not null" json:"community_uuid"`
	Title         string         `gorm:"type:varchar(255);not null" json:"title"`
	Img           string         `gorm:"type:varchar(255);not null" json:"img"`
	Detailed      string         `gorm:"type:text;not null" json:"detailed"`
	Date          time.Time      `gorm:"not null" json:"date"`
	Tags          IntArray       `gorm:"type:json;not null" json:"tags"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

type CommunityDetail struct {
	Name string `json:"name"`
	Img  string `json:"img"`
}
