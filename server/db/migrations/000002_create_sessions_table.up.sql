CREATE TABLE IF NOT EXISTS `sessions` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- セッションID（主キー）
    `user_uuid` VARCHAR(36) NOT NULL,                      -- ユーザーのUUID
    `session_key` VARCHAR(255) NOT NULL,                   -- セッションキー
    FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`)   -- ユーザーテーブルとの外部キー制約
);