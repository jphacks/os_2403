MIGRATE := migrate -path ./migrations -database "mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@tcp(${DATABASE_HOST}:${DATABASE_PORT})/${DATABASE_NAME}"

# ローカル環境の実行
.PHONY: run-local
run-local:
	docker-compose -f docker-compose.yml -f docker-compose.local.yml up

# ローカル環境の実行とビルド
.PHONY: run-local-build
run-local-build:
	docker-compose -f docker-compose.yml -f docker-compose.local.yml up --build

# ステージング環境の実行
.PHONY: run-staging
run-staging:
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up

# ステージング環境の実行とビルド
.PHONY: run-staging-build
run-staging-build:
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up　--build

# マイグレーションファイルの生成
.PHONY: migrate-create
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir db/migrations -seq $$name

# マイグレーションを実行（アップ）
.PHONY: migrate-up
migrate-up:
	$(MIGRATE) -path db/migrations up

# マイグレーションを1つ戻す（ダウン）
.PHONY: migrate-down
migrate-down:
	$(MIGRATE) -path db/migrations down 1

# マイグレーションを全て戻す
.PHONY: migrate-reset
migrate-reset:
	$(MIGRATE) -path db/migrations down

# 現在のバージョンを確認
.PHONY: migrate-version
migrate-version:
	$(MIGRATE) -path db/migrations version

# Dirtyフラグを強制的にクリア
.PHONY: migrate-force
migrate-force:
	@read -p "Enter version number to force: " version; \
	$(MIGRATE) -path db/migrations force $$version

# マイグレーション状態を確認
.PHONY: migrate-status
migrate-status:
	$(MIGRATE) -path db/migrations status
