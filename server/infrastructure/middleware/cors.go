package middleware

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// CORSミドルウェア
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*") // すべてのオリジンを許可
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Accept")
		// c.Header("Access-Control-Allow-Credentials", "true") // ワイルドカード使用時はコメントアウト
		c.Header("Access-Control-Expose-Headers", "Set-Cookie")
		c.Header("Access-Control-Max-Age", "100")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next() // 次のハンドラーを呼び出す
	}
}
