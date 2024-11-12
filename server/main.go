// main.go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/jphacks/os_2403/infrastructure/dao"
	"github.com/jphacks/os_2403/infrastructure/middleware"
	"github.com/jphacks/os_2403/interfaces/handlers"
	"github.com/jphacks/os_2403/usecase"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"net/http"
	"os"
)

func main() {
	// データベース接続の初期化
	db, err := initDB()
	if err != nil {
		log.Fatal(err)
	}

	// 一旦使ったことにする
	fmt.Println(db)

	// 初期化はinfra(persistence)->domain/service->usecase->handlerの順番で行うようにしよう

	store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))

	userRepo := dao.NewUserRepository(db)
	tagRepo := dao.NewTagRepository(db)
	memberRepo := dao.NewMemberRepository(db)
	sessionRepo := dao.NewSessionRepository(db)
	communityRepo := dao.NewCommunityRepository(db)
	scoutListRepo := dao.NewscoutListRepository(db)
	eventRepo := dao.NewEventRepository(db)

	authUserUsecase := usecase.NewAuthUserUseCase(userRepo, sessionRepo, memberRepo, tagRepo)
	authcommunityUsecase := usecase.NewAuthCommunityUseCase(communityRepo, sessionRepo, memberRepo, tagRepo)
	userUsecase := usecase.NewUserUseCase(userRepo, memberRepo, tagRepo)
	communityUsecase := usecase.NewCommunityUseCase(communityRepo, memberRepo, tagRepo)
	scoutListUsecase := usecase.NewScoutListUsecase(scoutListRepo, userRepo, communityRepo)
	eventUsecase := usecase.NewEventUsecase(eventRepo)
	tagUsecase := usecase.NewTagUseCase(tagRepo)

	authUserHandler := handlers.NewAuthUserHandler(authUserUsecase, store)
	authCommunityHandler := handlers.NewAuthCommunityHandler(authcommunityUsecase, store)
	userHandler := handlers.NewUserHandler(userUsecase)
	communityHandler := handlers.NewCommunityHandler(communityUsecase)
	scoutListHandler := handlers.NewScoutListHandler(scoutListUsecase, userUsecase)
	tagHandler := handlers.NewTagHandler(tagUsecase)
	eventHandler := handlers.NewEventHandler(eventUsecase, communityUsecase)

	// WebSocketの初期化
	wsService := middleware.NewWebSocketService()
	messageRepo := dao.NewMessageRepository(db)
	chatUsecase := usecase.NewChatUseCase(messageRepo, wsService)
	chatHandler := handlers.NewChatHandler(chatUsecase, wsService) // 他の初期化ここに書いてね

	// ルーティング
	router := gin.Default()

	// ミドルウェアの初期化
	//authMiddleware := middleware.NewAuthMiddleware(store)
	router.Use(middleware.CORS())

	router.GET("/health", health)

	router.POST("/user/signin", authUserHandler.SignIn)
	router.POST("/user/signup", authUserHandler.SignUp)

	router.GET("/user/:uuid", userHandler.FindByID)
	router.PUT("/user/:uuid", userHandler.Update)

	router.POST("/community/signin", authCommunityHandler.SignIn)
	router.POST("/community/signup", authCommunityHandler.SignUp)

	router.GET("/community/:uuid", communityHandler.FindById)
	router.PUT("/community/:uuid", communityHandler.Update)

	router.GET("/tag", tagHandler.GetRandom)

	router.GET("/getscoutdetail", scoutListHandler.GetCommunityDetailByScoutList)
	router.POST("/createscout", scoutListHandler.CreateScouts)
	router.PUT("/changescoutstatus", scoutListHandler.ChangeStatus)
	router.GET("/getmessageuser", scoutListHandler.GetMessageUser)

	router.GET("/getevent", eventHandler.GetAllEvents)
	router.POST("/createdevent", eventHandler.CreateEvent)
	router.PUT("/updataevent", eventHandler.UpdateEvent)

	router.GET("/ws/chat/:room_id", chatHandler.HandleWebSocket)
	router.GET("/messages/:room_id", chatHandler.GetMessages) // チャット履歴取得用

	log.Fatal(http.ListenAndServe(":80", router))
}

// initDBは別ファイルの方がいいのかな\(´ω` \)
func initDB() (*gorm.DB, error) {
	// .envファイルの読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// 環境変数から接続情報を取得
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// 接続文字列の構築
	//dsn := fmt.Sprintf(
	//"host=%s user=%s password=%s dbname=%s port=%s sslmode=false",
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&multiStatements=true",
		dbUser, dbPassword, dbHost, dbPort, dbName,
	)

	// データベースに接続
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect database: %w", err)
	}
	//
	//sqlDB, err := db.DB()
	//if err != nil {
	//	rollbar.Error(err)
	//	panic(err)
	//}
	//dbDriver, err := migrate_mysql.WithInstance(sqlDB, &migrate_mysql.Config{})
	//if err != nil {
	//	rollbar.Error(err)
	//	panic(err)
	//}
	//m, err := migrate.NewWithDatabaseInstance("file://db/migrations", "mysql", dbDriver)
	//if err != nil {
	//	rollbar.Error(err)
	//	panic(err)
	//}
	//if err := m.Up(); err != nil && err != migrate.ErrNoChange {
	//	rollbar.Error(err)
	//	panic(err)
	//}
	//
	//db.Logger = db.Logger.LogMode(logger.Info)

	return db, nil
}

func health(c *gin.Context) {
	health := "ホゲホゲ"
	c.JSON(200, health)
}
