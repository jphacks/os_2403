package dao

import (
	"context"
	"errors"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"gorm.io/gorm"
)

type memberRepository struct {
	db *gorm.DB
}

func NewMemberRepository(db *gorm.DB) *memberRepository {
	return &memberRepository{db: db}
}

func (r *memberRepository) Create(ctx context.Context, member *models.Member) (uint, error) {
	// 同じメンバーが既に存在するかを確認
	fmt.Println(member.Name)
	var existingMember models.Member
	if err := r.db.WithContext(ctx).Where("name = ?", member.Name).First(&existingMember).Error; err == nil {
		// 既に存在する場合は、そのIDを返す
		return existingMember.ID, nil
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// その他のエラーが発生した場合
		return 0, err
	}

	// 同じメンバーが存在しない場合は新たに作成
	if err := r.db.WithContext(ctx).Create(member).Error; err != nil {
		return 0, err // 作成に失敗した場合は、0とエラーを返す
	}
	return member.ID, nil // 作成されたメンバーのIDを返す
}

func (r *memberRepository) FindByID(ctx context.Context, id uint) (*models.Member, error) {
	var member models.Member
	if err := r.db.WithContext(ctx).Where("id = ?", id).First(&member).Error; err != nil {
		return nil, err
	}
	return &member, nil
}
