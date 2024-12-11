package gpt

import (
	"context"
	"fmt"
	"github.com/jphacks/os_2403/domain/models"
	openai "github.com/sashabaranov/go-openai"
	"os"
)

type IOpenAIClient interface {
	CreateThread(context.Context, string, []*models.Tag) (string, error)
	CreateMessage(context.Context, string, string) error
	CreateRun(context.Context, string) error
	ListMessages(context.Context, string) (*openai.MessagesList, error)
	RetrieveRun(context.Context, string, string) (*openai.Run, error)
}

type OpenAIClient struct {
	client *openai.Client
}

func NewOpenAIClient(apiKey string) *OpenAIClient {
	return &OpenAIClient{
		client: openai.NewClient(apiKey),
	}
}

func (c *OpenAIClient) CreateThread(ctx context.Context, content string) (*openai.Thread, error) {
	fmt.Println(content)
	thread, err := c.client.CreateThread(ctx, openai.ThreadRequest{
		Messages: []openai.ThreadMessage{
			{
				Role:    "user",
				Content: content,
			},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("スレッドの作成に失敗しました: %v", err)
	}

	return &thread, nil
}

func (c *OpenAIClient) CreateMessage(ctx context.Context, threadID string, content string) error {
	if threadID == "" {
		return fmt.Errorf("threadID cannot be empty")
	}

	assistantID := os.Getenv("OPENAI_ASSISTANT_ID")
	if assistantID == "" {
		return fmt.Errorf("環境変数 OPENAI_ASSISTANT_ID が設定されていません")
	}

	_, err := c.client.CreateMessage(
		ctx,
		threadID, // thread_id
		openai.MessageRequest{
			Role:    "user",
			Content: content,
		},
	)
	if err != nil {
		return fmt.Errorf("メッセージの作成に失敗しました: %v", err)
	}

	return nil
}

func (c *OpenAIClient) CreateRun(ctx context.Context, threadID string) (*openai.Run, error) {
	if threadID == "" {
		return nil, fmt.Errorf("threadID cannot be empty")
	}

	assistantID := os.Getenv("OPENAI_ASSISTANT_ID")
	if assistantID == "" {
		return nil, fmt.Errorf("環境変数 OPENAI_ASSISTANT_ID が設定されていません")
	}

	run, err := c.client.CreateRun(
		ctx,
		threadID,
		openai.RunRequest{
			AssistantID: assistantID,
		},
	)
	if err != nil {
		return nil, fmt.Errorf("Runの作成に失敗しました: %v", err)
	}

	return &run, nil
}

func (c *OpenAIClient) ListMessages(ctx context.Context, threadID string) (*openai.MessagesList, error) {
	if threadID == "" {
		return nil, fmt.Errorf("threadID cannot be empty")
	}

	messages, err := c.client.ListMessage(
		ctx,
		threadID,
		nil, // オプションパラメータはnil
		nil,
		nil,
		nil,
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("メッセージの取得に失敗しました: %v", err)
	}
	return &messages, nil
}

func (c *OpenAIClient) RetrieveRun(ctx context.Context, threadID string, runID string) (*openai.Run, error) {
	if threadID == "" {
		return nil, fmt.Errorf("threadID cannot be empty")
	}
	if runID == "" {
		return nil, fmt.Errorf("runID cannot be empty")
	}

	run, err := c.client.RetrieveRun(ctx, threadID, runID)
	if err != nil {
		return nil, fmt.Errorf("Runの取得に失敗しました: %v", err)
	}

	return &run, nil
}
