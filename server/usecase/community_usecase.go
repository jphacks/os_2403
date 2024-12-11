package usecase

import (
	"context"
	"fmt"
	"github.com/google/uuid"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
)

type InputCommunityUpdate struct {
	UUID     uuid.UUID
	Name     string
	Email    string
	Password string
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Tags     []string `json:"tag"`
}

type InputCommunityFindByID struct {
	UUID uuid.UUID
}

type CommunityResponse struct {
	UUID     uuid.UUID
	Name     string
	Email    string
	Password []byte
	Img      string
	Self     string
	Mem1     string
	Mem2     string
	Mem3     string
	Tags     []string `json:"tag"`
}

type GetAllCommunityResponse struct {
	UUID      uuid.UUID
	Name      string
	Img       string
	Self      string
	Mem1      string
	Tags      []string `json:"tag"`
	TagColors []string `json:"tag_color"`
}

type ICommunityUsecase interface {
	Update(ctx context.Context, input InputCommunityUpdate) error
	GetAll(ctx context.Context) ([]*GetAllCommunityResponse, error)
	FindByID(ctx context.Context, input InputCommunityFindByID) (*CommunityResponse, error)
}

type communityUsecase struct {
	communityRepo repositories.ICommunityRepository
	memberRepo    repositories.IMemberRepository
	tagRepo       repositories.ITagRepository
}

func NewCommunityUseCase(communityRepo repositories.ICommunityRepository, memberRepo repositories.IMemberRepository, tagRepo repositories.ITagRepository) ICommunityUsecase {
	return &communityUsecase{
		communityRepo: communityRepo,
		memberRepo:    memberRepo,
		tagRepo:       tagRepo,
	}
}

func (u *communityUsecase) Update(ctx context.Context, input InputCommunityUpdate) error {
	fmt.Println("usecase")
	fmt.Println(input)
	var community *models.Community

	// 既存コミュニティ情報を取得
	existingCommunity, err := u.communityRepo.FindByID(ctx, input.UUID.String())
	if err != nil {
		return fmt.Errorf("failed to find community: %v", err)
	}

	var mem1ID, mem2ID, mem3ID uint

	// Mem1 の更新
	if input.Mem1 != "" {
		mem1 := &models.Member{
			Name: input.Mem1,
		}
		mem1ID, _ = u.memberRepo.Create(ctx, mem1)
	} else {
		mem1ID = existingCommunity.Mem1 // 既存の値を保持
	}

	// Mem2 の更新
	if input.Mem2 != "" {
		mem2 := &models.Member{
			Name: input.Mem2,
		}
		mem2ID, _ = u.memberRepo.Create(ctx, mem2)
	} else {
		mem2ID = existingCommunity.Mem2 // 既存の値を保持
	}

	// Mem3 の更新
	if input.Mem3 != "" {
		mem3 := &models.Member{
			Name: input.Mem3,
		}
		mem3ID, _ = u.memberRepo.Create(ctx, mem3)
	} else {
		mem3ID = existingCommunity.Mem3 // 既存の値を保持
	}

	// Tags の更新
	var tags []int
	for _, t := range input.Tags {
		tag := models.NewTag(t)
		tagID, _ := u.tagRepo.Create(ctx, tag)
		tags = append(tags, tagID)
	}
	if len(tags) == 0 {
		tags = existingCommunity.Tags // Tags が空なら既存の値を保持
	}

	// 新規ユーザーの作成
	community = &models.Community{
		UUID:  input.UUID,
		Name:  input.Name,
		Email: input.Email,
		Img:   input.Img,
		Self:  input.Self,
		Mem1:  mem1ID,
		Mem2:  mem2ID,
		Mem3:  mem3ID,
		Tags:  tags,
	}

	fmt.Println(community)

	if err := u.communityRepo.Update(ctx, community); err != nil {
		return err
	}

	return nil
}

func (u *communityUsecase) GetAll(ctx context.Context) ([]*GetAllCommunityResponse, error) {
	communities, err := u.communityRepo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	var responses []*GetAllCommunityResponse
	for _, community := range communities {
		// Find members by ID
		mem1, _ := u.memberRepo.FindByID(ctx, community.Mem1)

		// Find tags by ID and collect their names
		tagNames := make([]string, 0, len(community.Tags))
		tagColor := make([]string, 0, len(community.Tags))
		for _, tagID := range community.Tags {
			tag, err := u.tagRepo.FindTagByID(ctx, tagID)
			if err != nil {
				return nil, fmt.Errorf("failed to find tag by ID (%d): %w", tagID, err)
			}
			tagNames = append(tagNames, tag.Name)
			tagColor = append(tagColor, tag.Color)
		}

		// Create the user response
		res := &GetAllCommunityResponse{
			UUID:      community.UUID,
			Name:      community.Name,
			Img:       community.Img,
			Self:      community.Self,
			Mem1:      mem1.Name,
			Tags:      tagNames,
			TagColors: tagColor,
		}
		// Append to the response list
		responses = append(responses, res)
	}

	return responses, nil
}

func (u *communityUsecase) FindByID(ctx context.Context, input InputCommunityFindByID) (*CommunityResponse, error) {
	community, err := u.communityRepo.FindByID(ctx, input.UUID.String())
	if err != nil {
		return nil, err
	}

	mem1, _ := u.memberRepo.FindByID(ctx, community.Mem1)
	mem2, _ := u.memberRepo.FindByID(ctx, community.Mem2)
	mem3, _ := u.memberRepo.FindByID(ctx, community.Mem3)

	// Find tags by ID and collect their names
	tagNames := make([]string, 0, len(community.Tags))
	for _, tagID := range community.Tags {
		tag, err := u.tagRepo.FindTagByID(ctx, tagID)
		if err != nil {
			return nil, fmt.Errorf("failed to find tag by ID (%d): %w", tagID, err)
		}
		tagNames = append(tagNames, tag.Name)
	}

	communityRes := &CommunityResponse{
		UUID:     community.UUID,
		Name:     community.Name,
		Email:    community.Email,
		Password: community.Password,
		Img:      community.Img,
		Self:     community.Self,
		Mem1:     mem1.Name,
		Mem2:     mem2.Name,
		Mem3:     mem3.Name,
		Tags:     tagNames,
	}
	return communityRes, nil
}
