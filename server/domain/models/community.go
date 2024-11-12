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
	UUID      uuid.UUID      `gorm:"primarykey;type:varchar(36)" json:"uuid"`
	Name      string         `gorm:"type:varchar(255);not null" json:"name"`
	Email     string         `gorm:"type:varchar(255);unique;not null" json:"email"`
	Password  []byte         `gorm:"type:varchar(255);not null" json:"password"`
	Img       string         `gorm:"type:varchar(255)" json:"img"`
	Self      string         `gorm:"type:text" json:"self"`
	Mem1      uint           `gorm:"type:int unsigned" json:"mem1"`
	Mem2      uint           `gorm:"type:int unsigned" json:"mem2"`
	Mem3      uint           `gorm:"type:int unsigned" json:"mem3"`
	Tags      IntArray       `gorm:"type:json" json:"tags"`
	MemRange  IntArray       `gorm:"column:MemRange;type:json" json:"range"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}
