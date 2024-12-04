gen/swagger:
	redocly bundle ./docs/swagger/root.swagger.yml --output=./docs/swagger/generated.gen.swagger.yml

MIGRATE := migrate -path ./migrations -database "mysql://${DATABASE_USER}:${DATABASE_PASSWORD}@tcp(${DATABASE_HOST}:${DATABASE_PORT})/${DATABASE_NAME}"

# 以前の環境での実行
.PHONY: run
run:
	docker-compose up
# ローカル環境の実行
.PHONY: run local
run:
	docker-compose -f server/docker-compose.yml -f server/docker-compose.local.yml up --build

# ステージング環境の実行
.PHONY: run staging
run-staging:
	docker-compose -f server/docker-compose.yml -f server/docker-compose.staging.yml up --build

# マイグレーションファイルの生成
.PHONY: migrate-create
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir server/db/migrations -seq $$name

# マイグレーションを実行（アップ）
.PHONY: migrate-up
migrate-up:
	$(MIGRATE) -path server/db/migrations up

# マイグレーションを1つ戻す（ダウン）
.PHONY: migrate-down
migrate-down:
	$(MIGRATE) -path server/db/migrations down 1

# マイグレーションを全て戻す
.PHONY: migrate-reset
migrate-reset:
	$(MIGRATE) -path server/db/migrations down

# 現在のバージョンを確認
.PHONY: migrate-version
migrate-version:
	$(MIGRATE) -path server/db/migrations version

# Dirtyフラグを強制的にクリア
.PHONY: migrate-force
migrate-force:
	@read -p "Enter version number to force: " version; \
	$(MIGRATE) -path server/db/migrations force $$version

# マイグレーション状態を確認
.PHONY: migrate-status
migrate-status:
	$(MIGRATE) -path server/db/migrations status
