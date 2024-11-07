# ビルドステージ
FROM --platform=linux/amd64 golang:1.23-alpine AS builder

WORKDIR /app

# ビルドに必要な依存関係をインストール
RUN apk add --no-cache gcc musl-dev

RUN go install github.com/air-verse/air@latest

# 依存関係をコピーしてダウンロード
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピーしてビルド
COPY . .
RUN CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o main

# 実行ステージ
FROM --platform=linux/amd64 alpine:3.19

WORKDIR /app

# SQLite3の実行に必要なライブラリをインストール
RUN apk add --no-cache sqlite-libs

# ビルドステージから実行可能ファイルをコピー
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
