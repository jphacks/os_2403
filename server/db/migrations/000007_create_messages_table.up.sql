CREATE TABLE IF NOT EXISTS `messages` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- メッセージID（主キー）
    `room_id` INT UNSIGNED NOT NULL,                      -- ルームID（外部キー）
    `message` VARCHAR(255) NOT NULL,                      -- メッセージ本文
    `user_id` CHAR(36) NOT NULL,                          -- メッセージ送信者（UUIDとして保存）
    `looked` TINYINT(1) DEFAULT 0,                        -- メッセージ確認済みフラグ（0: 未確認, 1: 確認済み）
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- 作成日時
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新日時
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,             -- 削除日時（論理削除）

-- 外部キー制約
    FOREIGN KEY (`room_id`) REFERENCES `scout_lists`(`id`),     -- ルームIDを参照
    FOREIGN KEY (`user_id`) REFERENCES `users`(`uuid`)    -- ユーザーUUIDを参照
    );
