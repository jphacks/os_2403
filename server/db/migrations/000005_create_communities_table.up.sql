CREATE TABLE IF NOT EXISTS `communities` (
    `uuid` VARCHAR(36) NOT NULL PRIMARY KEY, -- UUIDを主キーとして使用
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE, -- Emailはユニーク制約付き
    `password` VARCHAR(255) NOT NULL, -- パスワードのハッシュを保存
    `img` TEXT, -- プロフィール画像のURLなど
    `self` TEXT, -- 自己紹介などの自由記述用
    `mem1` INT UNSIGNED, -- uintに対応する正の整数
    `mem2` INT UNSIGNED,
    `mem3` INT UNSIGNED,
    `tags` JSON,
    `MemRange` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 作成日時
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- 更新日時
    `deleted_at` TIMESTAMP NULL DEFAULT NULL -- 論理削除用のフィールド
);
