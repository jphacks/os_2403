package models

type TagClickHistory struct {
	ID     uint   `gorm:"primarykey"`
	UUID   string `gorm:"not null"`
	Tag    string `gorm:"not null"`
	Action string `gorm:"type:enum('click', 'gpt');" json:"action"`
}
