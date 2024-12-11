package models

type Thread struct {
	ID       uint   `gorm:"primary_key"`
	ThreadID string `gorm:"not null"`
	UUID     string `gorm:"not null"`
}
