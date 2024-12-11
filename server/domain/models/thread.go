package models

type Thread struct {
	ID       uint   `gorm:"primary_key"`
	ThreadID string `gorm:"not null"`
	UserUUID string `gorm:"not null"`
}
