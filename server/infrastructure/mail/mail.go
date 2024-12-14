package mail

import (
	"crypto/tls"
	"github.com/jphacks/os_2403/domain/models"
	"gopkg.in/gomail.v2"
	"os"
	"sync"
)

type IMailClient interface {
	SendEmail(content string, user *models.User, community *models.Community) error
	SendBulkEmails(contents []string, users []*models.User, community *models.Community) error
	Close()
}

type MailClient struct {
	from     string
	dialer   *gomail.Dialer
	messages chan *gomail.Message
	quit     chan bool
}

func NewMailClient(from string) *MailClient {
	client := &MailClient{
		from:     from,
		messages: make(chan *gomail.Message, 100),
		quit:     make(chan bool),
	}

	// ダイヤラーを初期化（一度だけ）
	client.dialer = gomail.NewDialer(
		"smtp.gmail.com",
		587,
		from,
		os.Getenv("GOOGLE_ACCOUNT_TOKEN"),
	)
	client.dialer.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// バックグラウンドでメール送信を処理
	go client.backgroundSender()

	return client
}

func (c *MailClient) backgroundSender() {
	for {
		select {
		case msg := <-c.messages:
			if err := c.dialer.DialAndSend(msg); err != nil {
				// エラーログ処理
			}
		case <-c.quit:
			return
		}
	}
}

func (c *MailClient) SendEmail(content string, user *models.User, community *models.Community) error {
	m := gomail.NewMessage()
	m.SetHeader("From", c.from)
	m.SetHeader("To", user.Email)
	m.SetHeader("Subject", "[hubme]コミュニティからのスカウト")

	// メール本文
	body := "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
		"  " + community.Name + "からのスカウトのお知らせ\n" +
		"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n" +
		"こんにちは！\n\n" +
		"あなたのプロフィールを拝見し、ぜひ私たちのサークルに\n" +
		"参加していただきたいと思いご連絡させていただきました。\n\n" +
		"【サークル紹介】\n" +
		"----------------------------------------\n" +
		community.Self + "\n" +
		"----------------------------------------\n\n" +
		"【スカウトメッセージ】\n" +
		"----------------------------------------\n" +
		content + "\n" +
		"----------------------------------------\n\n" +
		"興味を持っていただけましたら、下記のURLから詳細をご確認ください。\n" +
		"→ https://hubme.click\n\n" +
		"ご連絡お待ちしております！\n\n" +
		"【連絡先】\n" +
		community.Email + "\n\n" +
		"----------------------------------------\n" +
		"Hubme ~サークルと学生を繋ぐプラットフォーム~\n" +
		"----------------------------------------"
	m.SetBody("text/plain", body)
	c.messages <- m
	return nil
}

// 複数メールの一括送信
func (c *MailClient) SendBulkEmails(contents []string, users []*models.User, community *models.Community) error {
	var wg sync.WaitGroup

	for i, user := range users {
		wg.Add(1)
		go func(content string, user *models.User) {
			defer wg.Done()
			c.SendEmail(content, user, community)
		}(contents[i], user)
	}

	wg.Wait()
	return nil
}

// アプリケーション終了時にクリーンアップ
func (c *MailClient) Close() {
	close(c.quit)
	close(c.messages)
}
