package usecase

import (
	"context"
	"errors"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	"github.com/jphacks/os_2403/domain/repositories"
	"github.com/jphacks/os_2403/infrastructure/gpt"
	"github.com/jphacks/os_2403/infrastructure/middleware"
	"strings"
	"time"
)

type IThreadUsecase interface {
	CreateThread(ctx context.Context, uuid string, tags []*models.Tag) (*string, error)
	ThreadMessage(ctx context.Context, threadID string, uuid string, tag string, tags []*models.Tag) ([]string, error)
	FindByUserUUID(ctx context.Context, threadID string) (*models.Thread, error)
}

type ThreadUsecase struct {
	threadRepo   repositories.IThreadRepository
	tagRepo      repositories.ITagRepository
	wsService    *middleware.WebSocketService
	openAIClient *gpt.OpenAIClient
}

type RecommendedTags struct {
	Recommended []string `json:"recommendedtags"`
}

func NewThreadUsecase(threadRepo repositories.IThreadRepository, wsService *middleware.WebSocketService, openAIClient *gpt.OpenAIClient) IThreadUsecase {
	return &ThreadUsecase{
		threadRepo:   threadRepo,
		wsService:    wsService,
		openAIClient: openAIClient,
	}
}

func (u *ThreadUsecase) CreateThread(ctx context.Context, uuid string, tags []*models.Tag) (*string, error) {
	if tags == nil {
		return nil, errors.New("tags cannot be nil")
	}

	var tagNames []string
	for _, tag := range tags {
		if tag == nil {
			continue
		}
		tagNames = append(tagNames, tag.Name)
	}

	openAIthread, err := u.openAIClient.CreateThread(ctx, gpt.Tag_list+strings.Join(tagNames, ","))
	if err != nil {
		return nil, err
	}

	_, err = u.threadRepo.Create(ctx, &models.Thread{
		UUID:     uuid,
		ThreadID: openAIthread.ID,
	})
	if err != nil {
		return nil, err
	}
	return &openAIthread.ID, nil
}

func (u *ThreadUsecase) ThreadMessage(ctx context.Context, threadID string, uuid string, tag string, tags []*models.Tag) ([]string, error) {
	err := u.openAIClient.CreateMessage(ctx, threadID, gpt.Tag_In+tag)
	if err != nil {
		return nil, err
	}

	run, err := u.openAIClient.CreateRun(ctx, threadID)
	if err != nil {
		return nil, err
	}

	for {
		run, err = u.openAIClient.RetrieveRun(ctx, threadID, run.ID)
		if err != nil {
			return nil, fmt.Errorf("run の取得に失敗: %v", err)
		}

		fmt.Printf("現在の状態: %s\n", run.Status)

		switch run.Status {
		case "completed":
			fmt.Println("実行が完了しました")
			messages, err := u.openAIClient.ListMessages(ctx, threadID)
			if err != nil {
				return nil, fmt.Errorf("メッセージの取得に失敗: %v", err)
			}

			var res []string
			if len(messages.Messages) > 0 && len(messages.Messages[0].Content) > 0 {
				firstContent := messages.Messages[0].Content[0]

				if firstContent.Type == "text" {
					text := firstContent.Text.Value
					suggestions := strings.Split(text, ",")

					tagNameMap := make(map[string]string)
					for _, t := range tags {
						tagNameMap[strings.ToLower(t.Name)] = t.Name
					}

					addedTags := make(map[string]struct{})

					for _, suggestion := range suggestions {
						normalizedSuggestion := strings.ToLower(strings.TrimSpace(suggestion))

						if originalTag, exists := tagNameMap[normalizedSuggestion]; exists {
							if _, alreadyAdded := addedTags[normalizedSuggestion]; !alreadyAdded {
								res = append(res, originalTag)
								addedTags[normalizedSuggestion] = struct{}{}
							}
						}
					}
				}
			}

			if len(res) > 0 {
				recommendedTags := RecommendedTags{
					Recommended: res,
				}
				u.wsService.BroadcastToRoom(uuid, recommendedTags)
			}

			return res, nil

		case "failed":
			return nil, fmt.Errorf("実行が失敗: %v", run.LastError)
		case "cancelled":
			return nil, fmt.Errorf("実行がキャンセル")
		case "expired":
			return nil, fmt.Errorf("実行が期限切れ")
		case "in_progress", "queued":
			time.Sleep(1 * time.Second)
			continue
		default:
			return nil, fmt.Errorf("未知の状態: %s", run.Status)
		}
	}
}

func (u *ThreadUsecase) FindByUserUUID(ctx context.Context, uuid string) (*models.Thread, error) {
	return u.threadRepo.FindByUserUUID(ctx, uuid)
}
