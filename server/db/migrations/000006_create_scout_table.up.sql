CREATE TABLE IF NOT EXISTS `scout_lists` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- 主キー
    `user_uuid` CHAR(36) NOT NULL,                         -- ユーザーUUID（外部キーとして扱う）
    `status` INT NOT NULL,                                 -- ステータス
    `community_uuid` CHAR(36) NOT NULL,                    -- コミュニティUUID（外部キーとして扱う）
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 作成日時
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新日時
    `deleted_at` TIMESTAMP NULL,                           -- 削除日時（論理削除）

-- 外部キー制約
    FOREIGN KEY (`user_uuid`) REFERENCES `users`(`uuid`),
    FOREIGN KEY (`community_uuid`) REFERENCES `communities`(`uuid`)
    );
