CREATE TABLE tag_click_histories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uuid VARCHAR(36),
    tag VARCHAR(255) NOT NULL,
    action enum('gpt', 'click'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid)  -- usersテーブルのuuidを参照
);