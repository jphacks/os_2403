package models

import "github.com/google/uuid"

type User struct {
	UUID     uuid.UUID `gorm:"primarykey;type:varchar(36)" json:"id"`
	Name     string    `gorm:"type:varchar(255);not null"`
	Email    string    `gorm:"type:varchar(255);unique;not null"`
	Password []byte    `gorm:"type:varchar(255);not null"`
	Img      string    `gorm:"type:varchar(255)"`
	Self     string    `gorm:"type:text"`
	Mem1     uint      `gorm:"type:int unsigned"`
	Mem2     uint      `gorm:"type:int unsigned"`
	Mem3     uint      `gorm:"type:int unsigned"`
	Tags     []int     `gorm:"type:json"`
}
