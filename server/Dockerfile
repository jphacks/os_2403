# Goのベースイメージを指定
FROM golang:1.23-alpine

# 必要なパッケージをインストール
RUN apk add --no-cache git

# AIRをインストール
RUN go install github.com/air-verse/air@latest

# ワーキングディレクトリを設定
WORKDIR /app

# ソースコードをコピー
COPY . .