package models

import (
	"database/sql/driver"
	"encoding/json"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

// IntArray は[]intのカスタム型
type IntArray []int

// Value はdatabase/sql/driver.Valuerインターフェースを実装
func (a IntArray) Value() (driver.Value, error) {
	if len(a) == 0 {
		return "[]", nil
	}
	return json.Marshal(a)
}

// Scan はsql.Scannerインターフェースを実装
func (a *IntArray) Scan(value interface{}) error {
	if value == nil {
		*a = make([]int, 0)
		return nil
	}
	return json.Unmarshal(value.([]byte), a)
}

type Community struct {
	UUID      uuid.UUID      `gorm:"primarykey;type:varchar(36)" json:"id"`
	Name      string         `gorm:"type:varchar(255);not null"`
	Email     string         `gorm:"type:varchar(255);unique;not null"`
	Password  []byte         `gorm:"type:varchar(255);not null"`
	Img       string         `gorm:"type:varchar(255)"`
	Self      string         `gorm:"type:text"`
	Mem1      uint           `gorm:"type:int unsigned"`
	Mem2      uint           `gorm:"type:int unsigned"`
	Mem3      uint           `gorm:"type:int unsigned"`
	Tags      IntArray       `gorm:"type:json" json:"tags"`
	MemRange  IntArray       `gorm:"column:MemRange;type:json" json:"range"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
