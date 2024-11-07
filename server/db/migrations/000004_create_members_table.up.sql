CREATE TABLE IF NOT EXISTS `members` (
   `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- メンバーID（主キー）
   `name` VARCHAR(255) NOT NULL                           -- メンバー名
);