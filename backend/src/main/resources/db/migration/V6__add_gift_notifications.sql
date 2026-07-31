CREATE TABLE gift_notifications (
    notification_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NULL,
    event_name VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message VARCHAR(500) NOT NULL,
    event_date DATE NOT NULL,
    remind_at DATETIME(6) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (notification_id),
    CONSTRAINT uk_gift_notification_event
        UNIQUE (user_id, profile_id, event_date, event_name),
    INDEX idx_gift_notifications_user_read
        (user_id, is_read, event_date),
    CONSTRAINT fk_gift_notifications_user
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_gift_notifications_profile
        FOREIGN KEY (profile_id) REFERENCES recipient_profiles (profile_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
