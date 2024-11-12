package models

import "github.com/google/uuid"

type User struct {
	UUID     uuid.UUID `gorm:"primarykey;type:varchar(36)" json:"uuid"`
	Name     string    `gorm:"type:varchar(255);not null" json:"name"`
	Email    string    `gorm:"type:varchar(255);unique;not null" json:"email"`
	Password []byte    `gorm:"type:varchar(255);not null" json:"password"`
	Img      string    `gorm:"type:varchar(255)" json:"img"`
	Self     string    `gorm:"type:text" json:"self"`
	Mem1     uint      `gorm:"type:int unsigned" json:"mem1"`
	Mem2     uint      `gorm:"type:int unsigned" json:"mem2"`
	Mem3     uint      `gorm:"type:int unsigned" json:"mem3"`
	Tags     IntArray  `gorm:"type:json" json:"tags"`
}
