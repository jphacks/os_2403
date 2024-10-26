// main.go
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	//"github.com/jphacks/os_2403/domain/services"
	//"github.com/jphacks/os_2403/infrastructure/dao"
	//"github.com/jphacks/os_2403/interfaces/handlers"
	//"github.com/jphacks/os_2403/usecase"
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
	// uuid系の初期化
	//uuidRepo := persistence.NewUUIDRepository(db)
	//uuidService := services.NewUUIDService()
	//uuidUseCase := usecase.NewUUIDUseCase(uuidRepo, uuidService)
	//uuidHandler := handlers.NewUUIDHandler(uuidUseCase)

	// 他の初期化ここに書いてね

	// ルーティング
	router := gin.Default()

	// ミドルウェアの初期化
	//authMiddleware := middleware.NewAuthMiddleware(store)
	//router.Use(middleware.CORS())

	router.GET("health", health)

	log.Fatal(http.ListenAndServe(":8080", router))
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

	return db, nil
}

func health(c *gin.Context) {
	health := "ホゲホゲ"
	c.JSON(200, health)
}
