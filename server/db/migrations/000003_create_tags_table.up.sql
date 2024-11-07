CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- タグID（主キー）
    `name` VARCHAR(255) NOT NULL                           -- タグ名
);