CREATE TABLE events (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        community_uuid VARCHAR(36),
                        title VARCHAR(255) NOT NULL,
                        img VARCHAR(255) NOT NULL,
                        detailed TEXT NOT NULL,
                        date DATETIME NOT NULL,
                        tags JSON NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        deleted_at TIMESTAMP NULL,
                        FOREIGN KEY (community_uuid) REFERENCES communities(uuid)  -- communitiesテーブルのuuidを参照
);
