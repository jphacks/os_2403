package models

import (
	"gorm.io/gorm"
	"time"
)

type Message struct {
	ID        uint           `gorm:"primarykey;" json:"id"`
	Message   string         `gorm:"type:varchar(255);not null"`
	UserID    string         `gorm:"type:varchar(255);not null"`
	RoomID    int            `gorm:"type:int;not null"`
	Looked    int            `gorm:"type:int;not null"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
